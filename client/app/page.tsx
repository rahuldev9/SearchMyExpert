"use client";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ExpertCard from "@/components/ExpertCard";
import Search from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Experts from "@/components/Expert";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <Hero />
      <section className="py-20 px-6 bg-gray-50 text-center">
        {" "}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12"
        >
          {" "}
          How Automation Works{" "}
        </motion.h2>{" "}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {" "}
          {[
            {
              title: "1. Post Automation Need",
              desc: "Describe the workflow or automation you want built.",
            },
            {
              title: "2. Get Expert Matches",
              desc: "Connect with automation experts who specialize in your tools.",
            },
            {
              title: "3. Launch Automation",
              desc: "Build, test, and deploy automation to scale your business.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-8 bg-white shadow-lg rounded-2xl hover:shadow-xl transition"
            >
              {" "}
              <h3 className="font-semibold text-xl mb-3">{item.title}</h3>{" "}
              <p className="text-gray-600">{item.desc}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 2 — Popular Automation Services */}{" "}
      <section className="py-20 px-6 text-center">
        {" "}
        <h2 className="text-3xl font-bold mb-12">
          {" "}
          Popular Automation Services{" "}
        </h2>{" "}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {" "}
          {[
            {
              title: "CRM Automation",
              desc: "Automate lead capture and customer workflows.",
            },
            {
              title: "Email Automation",
              desc: "Automate marketing emails and follow-ups.",
            },
            {
              title: "Data Sync",
              desc: "Sync data between apps automatically.",
            },
            {
              title: "AI Chatbots",
              desc: "Build smart AI assistants for business workflows.",
            },
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="p-8 bg-white shadow rounded-2xl hover:shadow-xl transition"
            >
              {" "}
              <h3 className="font-semibold text-lg">{service.title}</h3>{" "}
              <p className="text-gray-600 text-sm mt-2">{service.desc}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 3 — Platform Stats */}{" "}
      <section className="py-20 px-6 bg-blue-500 text-white text-center">
        {" "}
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {" "}
          {[
            { number: "500+", label: "Automation Projects" },
            { number: "120+", label: "Expert Engineers" },
            { number: "80+", label: "Business Clients" },
            { number: "20+", label: "Integrated Tools" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              {" "}
              <h3 className="text-3xl font-bold">{stat.number}</h3>{" "}
              <p className="text-blue-100 mt-2">{stat.label}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 4 — Why Choose Us */}{" "}
      <section className="py-20 px-6 bg-gray-50 text-center">
        {" "}
        <h2 className="text-3xl font-bold mb-12">
          {" "}
          Why Businesses Choose Our Experts{" "}
        </h2>{" "}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {" "}
          {[
            {
              title: "Verified Experts",
              desc: "Work with vetted automation professionals.",
            },
            {
              title: "Fast Delivery",
              desc: "Launch automations in days, not months.",
            },
            {
              title: "Scalable Workflows",
              desc: "Build systems that grow with your business.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              {" "}
              <h3 className="font-semibold text-xl mb-3">{item.title}</h3>{" "}
              <p className="text-gray-600">{item.desc}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 5 — Tools Integrations */}{" "}
      <section className="py-20 px-6 text-center">
        {" "}
        <h2 className="text-3xl font-bold mb-12"> Tools We Automate </h2>{" "}
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {" "}
          {[
            "Google Sheets",
            "Slack",
            "HubSpot",
            "Zapier",
            "Make.com",
            "Airtable",
            "Notion",
            "OpenAI",
          ].map((tool, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-white border rounded-xl shadow-sm"
            >
              {" "}
              {tool}{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 6 — Testimonials */}{" "}
      <section className="py-20 px-6 bg-gray-50 text-center">
        {" "}
        <h2 className="text-3xl font-bold mb-12"> What Businesses Say </h2>{" "}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {" "}
          {[
            {
              quote:
                "We automated our CRM workflows and saved 20+ hours per week.",
              name: "Michael Brown",
              role: "Startup Founder",
            },
            {
              quote: "Our marketing automation now runs completely hands-free.",
              name: "Sophia Lee",
              role: "Marketing Director",
            },
            {
              quote: "Hiring automation experts transformed our operations.",
              name: "Daniel Carter",
              role: "Tech Founder",
            },
          ].map((test, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white p-8 shadow rounded-2xl"
            >
              {" "}
              <p className="text-gray-600 mb-4">“{test.quote}”</p>{" "}
              <h4 className="font-semibold">{test.name}</h4>{" "}
              <p className="text-sm text-gray-500">{test.role}</p>{" "}
            </motion.div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* Section 7 — CTA */}{" "}
      <section className="py-20 px-6 text-center bg-blue-500 text-white">
        {" "}
        <h2 className="text-3xl font-bold mb-6">
          {" "}
          Ready to Automate Your Business?{" "}
        </h2>{" "}
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          {" "}
          Connect with expert automation engineers and build workflows that save
          time and increase productivity.{" "}
        </p>{" "}
        <button
          onClick={() => router.push("/experts")}
          className="bg-white text-blue-500 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
        >
          {" "}
          Find Experts{" "}
        </button>{" "}
      </section>
      <Footer />
    </div>
  );
}
