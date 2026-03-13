"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import API from "../lib/api";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ExpertMatcher({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const findExperts = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await API.post("/api/ai", { prompt: query });
      setMatches(res.data || []);
    } catch (err) {
      console.error("AI error", err);
      setMatches([]);
    }

    setLoading(false);
  };

  const openProfile = (id: string) => {
    router.push(`/profile/${id}`);
    onClose();
  };
  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm p-4 pt-[10vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 mr-3" />

            <textarea
              ref={inputRef}
              placeholder="Describe the expert you need... (Example: Zapier automation expert with OpenAI chatbot)"
              className="flex-1 outline-none text-sm resize-none"
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search Button */}
          <div className="p-4 self-end">
            <button
              onClick={findExperts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Searching..." : "Find Experts"}
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto p-4 space-y-4">
            {matches.length > 0 ? (
              matches.map((item: any, index) => {
                const expert = item?.expert;
                if (!expert) return null;

                return (
                  <div
                    key={expert._id || index}
                    onClick={() => openProfile(expert._id)}
                    className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    {/* Top Section */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {expert.name?.charAt(0)}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-900">
                            {expert.name}
                          </div>

                          <div className="text-xs text-gray-500">
                            ⭐ {expert.rating || 0} • {expert.experience || 0}{" "}
                            yrs
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-blue-600">
                        ${expert.hourlyRate || 0}/hr
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {expert.bio}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {expert.skills
                        ?.slice(0, 4)
                        .map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>

                    {/* Bottom */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-gray-500">
                        📍 {expert.location}
                      </div>

                      <div className="text-xs text-green-600 font-medium">
                        AI Match: {item.reason}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : loading ? (
              <div className="p-8 text-center text-gray-400">
                AI is finding experts...
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                Describe your project to find matching experts
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )
  );
}
