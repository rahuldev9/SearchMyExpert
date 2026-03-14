import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MatchAI() {
  const router = useRouter();
  return (
    <div className="bg-white border-none rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-blue-600" />
        <h3 className="font-semibold text-lg">Match with AI</h3>
      </div>

      <p className="text-gray-500 mb-4">
        Let AI automatically match your project with the best experts.
      </p>

      <button
        onClick={() => router.push("/experts")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Find Experts
      </button>
    </div>
  );
}
