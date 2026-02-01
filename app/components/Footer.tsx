import { Orbitron } from "next/font/google";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
const schoolFont = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const Footer = () => {
  return (
    <footer className="bg-[#050505] text-gray-400 py-16 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Logo & About */}
          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold font-outfit text-white uppercase tracking-wider">
              Kawempe Muslim <br /> Secondary School
            </h3>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              Providing quality education and holistic development for students.
              Join us to grow, learn, and achieve excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-outfit text-gray-300 uppercase tracking-[0.2em]">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  About
                </a>
              </li>
              <li>
                <a href="/academics" className="text-sm hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Academics
                </a>
              </li>
              <li>
                <a href="/admissions" className="text-sm hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Admissions
                </a>
              </li>
              <li>
                <a href="/portal/student" className="text-sm hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-green-500 rounded-full" />
                  Students Portal
                </a>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-outfit text-gray-300 uppercase tracking-[0.2em]">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/news" className="text-sm hover:text-white transition-colors duration-300">Latest News</a>
              </li>
              <li>
                <a href="/events" className="text-sm hover:text-white transition-colors duration-300">School Calendar</a>
              </li>
              <li>
                <a href="/academics/timetables" className="text-sm hover:text-white transition-colors duration-300">Timetables</a>
              </li>
              <li>
                <a href="/location" className="text-sm hover:text-white transition-colors duration-300">Visit Us</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold font-outfit text-gray-300 uppercase tracking-[0.2em]">
              Contact Us
            </h4>
            <div className="space-y-4">
              <p className="text-sm flex flex-col gap-1">
                <span className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Email</span>
                <span className="text-gray-300">kawempemuslimss@yahoo.com</span>
              </p>
              <p className="text-sm flex flex-col gap-1">
                <span className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Phone</span>
                <span className="text-gray-300">+256 700 000 000</span>
              </p>
              <p className="text-sm flex flex-col gap-1">
                <span className="text-gray-600 text-[10px] uppercase font-bold tracking-wider">Address</span>
                <span className="text-gray-300">Kampala, Uganda</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Social Icons */}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 bg-white/5 p-2 rounded-lg">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 bg-white/5 p-2 rounded-lg">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 bg-white/5 p-2 rounded-lg">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 bg-white/5 p-2 rounded-lg">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
          </div>

          <div
            className={`${schoolFont.className} flex flex-col items-center md:items-end gap-1 opacity-60`}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Powered by</p>
            <p className="text-sm font-bold text-white tracking-widest">TAZON</p>
          </div>

          <div className="text-gray-600 text-[11px] uppercase tracking-widest font-medium">
            © {new Date().getFullYear()} KMSS • All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
