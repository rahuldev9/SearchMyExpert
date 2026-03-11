import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            Find the Right{" "}
            <span className="text-yellow-300">Automation & AI Experts</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-xl mx-auto md:mx-0">
            Connect with skilled automation engineers who can build workflows
            between tools like Google Sheets, Gmail, Slack, and CRM systems to
            save time and scale your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link
              href="/experts"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
            >
              Find Experts
            </Link>

            <Link
              href="/register"
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-center"
            >
              Post Automation Request
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md md:max-w-lg">
            <Image
              src="/automation-workflow.png"
              alt="Automation workflow connecting apps"
              width={600}
              height={450}
              className="rounded-xl shadow-xl object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
