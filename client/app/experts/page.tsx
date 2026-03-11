import ExpertCard from "@/components/ExpertCard";
import { experts } from "../data/experts";
import Search from "@/components/SearchBar";
import Experts from "@/components/Expert";

export default function ExpertsPage() {
  return (
    <div className="max-w-6xl mx-auto ">
      <Search />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experts.map((expert) => (
          <ExpertCard key={expert.id} {...expert} />
        ))}
      </div>
      <Experts />
    </div>
  );
}
