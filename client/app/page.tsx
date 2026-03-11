import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ExpertCard from "@/components/ExpertCard";
import Search from "@/components/SearchBar";
import Navbar from "@/components/Navbar";

export default function Home() {
  const featuredExperts = [
    {
      id: 1,
      name: "Sarah Smith",
      skills: ["AI", "n8n", "Chatbots"],
      rating: 4.9,
      location: "USA",
      price: "$95/hr",
      bio: "AI automation expert building intelligent chatbots.",
    },
    {
      id: 2,
      name: "David Lee",
      skills: ["Zapier", "API", "Automation"],
      rating: 4.8,
      location: "Canada",
      price: "$80/hr",
      bio: "Zapier expert creating powerful business workflows.",
    },
    {
      id: 3,
      name: "Emma Watson",
      skills: ["Make", "Integrations", "Webhooks"],
      rating: 4.7,
      location: "UK",
      price: "$85/hr",
      bio: "Automation consultant specializing in SaaS integrations.",
    },
  ];

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <Hero />

      {/* Section 1 — How It Works */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-10">How Automation Works</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-xl mb-3">
              1. Post Automation Need
            </h3>
            <p className="text-gray-600">
              Describe the workflow or automation you want built.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-xl mb-3">
              2. Get Expert Matches
            </h3>
            <p className="text-gray-600">
              Connect with automation experts who specialize in your tools.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-xl mb-3">3. Launch Automation</h3>
            <p className="text-gray-600">
              Build, test, and deploy automation to scale your business.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Featured Experts */}
      <Search />

      {/* Section 3 — Popular Automation Services */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Popular Automation Services
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-lg">CRM Automation</h3>
            <p className="text-gray-600 text-sm mt-2">
              Automate lead capture and customer workflows.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-lg">Email Automation</h3>
            <p className="text-gray-600 text-sm mt-2">
              Automate marketing emails and follow-ups.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-lg">Data Sync</h3>
            <p className="text-gray-600 text-sm mt-2">
              Sync data between apps automatically.
            </p>
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="font-semibold text-lg">AI Chatbots</h3>
            <p className="text-gray-600 text-sm mt-2">
              Build smart AI assistants for business workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — Testimonials */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">What Businesses Say</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-white p-6 shadow rounded-xl">
            <p className="text-gray-600 mb-4">
              “We automated our CRM workflows and saved 20+ hours per week.”
            </p>
            <h4 className="font-semibold">Michael Brown</h4>
            <p className="text-sm text-gray-500">Startup Founder</p>
          </div>

          <div className="bg-white p-6 shadow rounded-xl">
            <p className="text-gray-600 mb-4">
              “Our marketing automation now runs completely hands-free.”
            </p>
            <h4 className="font-semibold">Sophia Lee</h4>
            <p className="text-sm text-gray-500">Marketing Director</p>
          </div>

          <div className="bg-white p-6 shadow rounded-xl">
            <p className="text-gray-600 mb-4">
              “Hiring automation experts from this platform transformed our
              operations.”
            </p>
            <h4 className="font-semibold">Daniel Carter</h4>
            <p className="text-sm text-gray-500">Tech Founder</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
