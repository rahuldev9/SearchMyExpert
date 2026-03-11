type Props = {
  title: string;
  description: string;
  budget: number;
};

export default function MyRequestCard({ title, description, budget }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="flex justify-between items-center">
        <span className="text-blue-600 font-semibold">${budget}</span>

        <span className="text-sm text-gray-400">Your Request</span>
      </div>
    </div>
  );
}
