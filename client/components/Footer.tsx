import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>

          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/how-it-works"
                className="hover:text-white transition"
              >
                How It Works
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            For Businesses
          </h3>

          <ul className="space-y-2">
            <li>
              <Link href="/experts" className="hover:text-white transition">
                Find Experts
              </Link>
            </li>

            <li>
              <Link
                href="/post-request"
                className="hover:text-white transition"
              >
                Post Request
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">For Experts</h3>

          <ul className="space-y-2">
            <li>
              <Link
                href="/become-expert"
                className="hover:text-white transition"
              >
                Become an Expert
              </Link>
            </li>

            <li>
              <Link
                href="/expert-guidelines"
                className="hover:text-white transition"
              >
                Expert Guidelines
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Support</h3>

          <ul className="space-y-2">
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social + Bottom */}
      <div className="border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AutoMatch AI. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="https://linkedin.com"
              className="hover:text-white transition"
            >
              LinkedIn
            </Link>

            <Link
              href="https://twitter.com"
              className="hover:text-white transition"
            >
              Twitter
            </Link>

            <Link
              href="https://github.com"
              className="hover:text-white transition"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
