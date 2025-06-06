export default function Footer() {
  return (
    <footer className="bg-lv-brown text-lv-cream py-16 bg-gray-100">
      <div className="max-w-7xl  mx-auto px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lv-fade-in delay-200">
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Services
            </h3>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              About LUV VENCENCIA
            </h3>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              FAQ
            </h3>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Product Care
            </h3>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Gift Services
            </h3>
          </div>

          {/* Customer Care */}
          <div className="lv-fade-in delay-100">
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Customer Care
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-primary font-mono lv-transition"
                >
                  Contact Us
                </a>
              </li>
              {/* <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-primary font-mono lv-transition"
                >
                  Find a Store
                </a>
              </li> */}

              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-primary font-mono lv-transition"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="lv-body text-gray-500 hover:text-primary font-mono lv-transition"
                >
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="lv-luxury mb-4 text-md font-bold text-primary">
              Newsletter
            </h3>
            <p className="lv-body text-gray-500 hover:text-primary font-mono lv-transition">
              Be the first to know about new arrivals and exclusive events.
            </p>
            <div className="flex flex-col sm:flex-row gap-2"></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="lv-luxury mb-4 text-xs font-bold text-primary">
              © 2025 LUV VENCENCIA - All rights reserved.
            </div>
            <div className="flex flex-wrap text-xs gap-4 v-body font-normal text-gray-500 hover:text-primary font-mono lv-transition">
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
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
