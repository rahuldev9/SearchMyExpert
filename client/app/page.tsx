"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";

export default function Home() {
  const router = useRouter();

  const steps = [
    { title: "Post Project", desc: "Businesses publish project requirements." },
    { title: "Experts Discover", desc: "Experts browse projects and apply." },
    { title: "Collaborate", desc: "Chat and collaborate directly." },
    { title: "Complete", desc: "Experts deliver and mark project complete." },
    { title: "Review", desc: "Businesses leave reviews and feedback." },
  ];

  const features = [
    {
      title: "AI Expert Matching",
      desc: "AI analyzes project requirements and suggests relevant experts.",
    },
    {
      title: "Global Expert Search",
      desc: "Search and filter experts by skills, experience, and reviews.",
    },
    {
      title: "Secure Authentication",
      desc: "Email login, Google OAuth, and account verification.",
    },
    {
      title: "Project Collaboration",
      desc: "Communicate with experts through built-in chat.",
    },
    {
      title: "Project Workflow",
      desc: "Complete lifecycle from project posting to delivery.",
    },
    {
      title: "Profile Management",
      desc: "Experts showcase experience, skills, and portfolio.",
    },
  ];

  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      <Navbar />
      <Hero />
      {/* HERO */}

      {/* WORKFLOW */}
      <section className="py-28 px-6 bg-gray-50">
        <h2 className="text-4xl text-center font-bold mb-16">
          How SearchMyExpert Works
        </h2>

        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="text-center max-w-xs"
            >
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {i + 1}
              </div>

              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="py-28 px-6">
        <h2 className="text-4xl text-center font-bold mb-16">
          Platform Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>

              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI MATCHING SECTION */}
      <section className="py-28 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            AI-Powered Expert Matching
          </h2>

          <p className="text-blue-100 max-w-2xl mx-auto mb-10">
            Describe your project requirements and our AI will analyze skills,
            experience, and project type to recommend the best experts for your
            needs.
          </p>

          <button
            onClick={() => router.push("/experts")}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold"
          >
            Try AI Matching
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="grid md:grid-cols-4 gap-10 text-center max-w-6xl mx-auto">
          {[
            { number: "500+", label: "Projects Posted" },
            { number: "120+", label: "Expert Professionals" },
            { number: "80+", label: "Business Clients" },
            { number: "20+", label: "Integrated Tools" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-4xl font-bold">{stat.number}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 text-center">
        <h2 className="text-4xl font-bold mb-16">Trusted by Businesses</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              quote:
                "We found expert developers within hours using this platform.",
              name: "Michael Brown",
            },
            {
              quote: "SearchMyExpert made hiring specialists incredibly easy.",
              name: "Sophia Lee",
            },
            {
              quote: "The collaboration tools made project delivery smooth.",
              name: "Daniel Carter",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white p-8 rounded-2xl shadow"
            >
              <p className="text-gray-600 mb-4">“{item.quote}”</p>

              <h4 className="font-semibold">{item.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center bg-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-6">
          Start Your Next Project Today
        </h2>

        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Connect with experts, collaborate efficiently, and complete projects
          faster with SearchMyExpert.
        </p>

        <button
          onClick={() => router.push("/experts")}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold"
        >
          Explore Experts
        </button>
      </section>

      <Footer />
    </div>
  );
}
