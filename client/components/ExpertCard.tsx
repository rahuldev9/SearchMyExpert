import Link from "next/link";

type Props = {
  id: number;
  name: string;
  skills: string[];
  rating: number;
  location: string;
  price: string;
  bio: string;
};

export default function ExpertCard({
  id,
  name,
  skills,
  rating,
  location,
  price,
  bio,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">⭐ {rating}</p>
          <p className="text-xs text-gray-400">{location}</p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 mt-3">{bio}</p>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm font-medium text-gray-700">{price}</span>

        <Link
          href={`/experts/${id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
