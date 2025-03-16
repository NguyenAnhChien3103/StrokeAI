"use client";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="container mx-auto py-10 px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-16 text-left">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="StrokeAI Logo" width={40} height={40} />
              <span className="text-2xl font-semibold text-teal-600">StrokeAI</span>
            </div>
            <div className="mt-3">
              <div className="flex gap-4 text-2xl">
                <Link href="https://www.facebook.com" className="!no-underline !text-black">
                  <FaFacebook />
                </Link>
                <Link href="https://www.instagram.com" className="!no-underline !text-black">
                  <FaInstagram />
                </Link>
                <Link href="https://www.youtube.com" className="!no-underline !text-black">
                  <FaYoutube />
                </Link>
                <Link href="https://www.tiktok.com" className="!no-underline !text-black">
                  <FaTiktok />
                </Link>
              </div>
              <div className="pt-3">
                <p>Email: strokeai@gmail.com</p>
                <p>Phone: 09899998868</p>
              </div>
            </div>
          </div>
          {/* Cột 2 */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">USEFUL LINKS</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy" className="!no-underline !text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/services" className="!no-underline !text-black">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/forums" className="!no-underline !text-black">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/categories" className="!no-underline !text-black">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="!no-underline !text-black">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          {/* Cột 3 */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">QUICK ACCESS</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/licenses" className="!no-underline !text-black">
                  Licenses
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="!no-underline !text-black">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/contact" className="!no-underline !text-black">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="!no-underline !text-black">
                  Support Policy
                </Link>
              </li>
            </ul>
          </div>
          {/* Cột 4 */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">MORE LINKS</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="!no-underline !text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="!no-underline !text-black">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link href="/office" className="!no-underline !text-black">
                  Our Office
                </Link>
              </li>
              <li>
                <Link href="/location" className="!no-underline !text-black">
                  Our Location
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-teal-700 text-white text-center py-3">
        &copy; Người chịu trách nhiệm nội dung: Ano
      </div>
    </footer>
  );
}
