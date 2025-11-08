import React from "react";
import {  
  UtensilsCrossed
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-gray-900 to-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">ZaikaRestro</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Authentic flavors delivered to your doorstep. Experience the taste of tradition.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Home</li>
                <li></li>
                <li></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 +91 98765 43210</li>
                <li>📧 contact@zaikarestro.com</li>
                <li>📍 123 Food Street, Mumbai</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Opening Hours</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Monday - Friday: 11 AM - 11 PM</li>
                <li>Saturday - Sunday: 10 AM - 12 AM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 ZaikaRestro. All rights reserved. Built with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
