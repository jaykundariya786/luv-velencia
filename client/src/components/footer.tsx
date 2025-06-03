export default function Footer() {
  return (
    <footer className="bg-gray-300  text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Customer Care */}
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider vintage-heading">
              Customer Care
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Find a Store
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Book an Appointment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider vintage-heading">
              Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Gift Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Product Care
                </a>
              </li>
            </ul>
          </div>

          {/* About Gucci */}
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider vintage-heading">
              About Gucci
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Corporate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gucci-gradient transition-colors elegant-body royal-hover"
                >
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium mb-4 text-sm uppercase tracking-wider vintage-heading">
              Newsletter
            </h3>
            <p className="text-sm mb-4">
              Be the first to know about new arrivals and exclusive events.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 bg-transparent border border-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
              <button className="bg-white text-black px-4 py-2 text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
                Subscribe
              </button> */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Guccio Gucci S.p.A. - All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
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
