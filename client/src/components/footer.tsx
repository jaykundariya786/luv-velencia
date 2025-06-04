export default function Footer() {
  return (
    <footer className="bg-lv-brown text-lv-cream py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Customer Care */}
          <div className="lv-fade-in delay-100">
            <h3 className="lv-luxury mb-4 text-md font-bold text-black">
              Customer Care
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Find a Store
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Book an Appointment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lv-fade-in delay-200">
            <h3 className="lv-luxury mb-4 text-md font-bold text-black">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Gift Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Product Care
                </a>
              </li>
            </ul>
          </div>

          {/* About Gucci */}
          <div>
            <h3 className="lv-luxury mb-4 text-md font-bold text-black">
              About Gucci
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Corporate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-black font-mono lv-transition"
                >
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="lv-luxury mb-4 text-md font-bold text-black">
              Newsletter
            </h3>
            <p className="lv-body text-gray-500 hover:text-black font-mono lv-transition">
              Be the first to know about new arrivals and exclusive events.
            </p>
            <div className="flex flex-col sm:flex-row gap-2"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="lv-luxury mb-4 text-xs font-bold text-black">
              © 2025 LUV VENCENCIA - All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
