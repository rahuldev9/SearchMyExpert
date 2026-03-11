import HireButton from "@/components/HireButton";
import { experts } from "../../data/experts";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ExpertProfile({ params }: Props) {
  const { id } = await params;

  const expert = experts.find((e) => e.id === Number(id));

  if (!expert) {
    return <div className="p-10 text-center text-xl">Expert not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back */}
      <Link href="/experts" className="text-blue-600 hover:underline">
        ← Back to Experts
      </Link>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 mt-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
            {expert.name.charAt(0)}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold">{expert.name}</h1>

            <p className="text-gray-500">⭐ {expert.rating}</p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-gray-700">{expert?.bio}</p>

        {/* Skills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {expert.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Hire Button */}
        <HireButton />
      </div>
    </div>
  );
}
