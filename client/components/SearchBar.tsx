"use client";

import { useState } from "react";
import ExpertCard from "@/components/ExpertCard";
import { experts } from "../app/data/experts";

export default function Search() {
  const [search, setSearch] = useState("");

  const filteredExperts = experts.filter((expert) => {
    const text = search.toLowerCase();

    return (
      expert.name.toLowerCase().includes(text) ||
      expert.location.toLowerCase().includes(text) ||
      expert.bio.toLowerCase().includes(text) ||
      expert.price.toLowerCase().includes(text) ||
      expert.skills.some((skill) => skill.toLowerCase().includes(text)) ||
      expert.rating.toString().includes(text)
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-6">Automation Experts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, skills, rating, location..."
        className="w-full mb-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Experts Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredExperts.map((expert) => (
          <ExpertCard key={expert.id} {...expert} />
        ))}
      </div>

      {filteredExperts.length === 0 && (
        <p className="text-gray-500 mt-10">No experts found.</p>
      )}
    </div>
  );
}
