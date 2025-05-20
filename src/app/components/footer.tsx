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
              <Image src="/logo.png" alt="Logo StrokeAI" width={40} height={40} />
              <span className="text-2xl font-semibold text-cyan-500">StrokeAI</span>
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
                <p>Điện thoại: 09899998868</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">LIÊN KẾT HỮU ÍCH</h4>
            <ul className="space-y-1">
              <li>
                <p className="!text-black">Chính sách bảo mật</p>
              </li>
              <li>
                <p className="!text-black">Dịch vụ của chúng tôi</p>
              </li>
              <li>
                <p className="!text-black">Diễn đàn</p>
              </li>
              <li>
                <p className="!text-black">Danh mục</p>
              </li>
              <li>
                <p className="!text-black">Đánh giá từ khách hàng</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">TRUY CẬP NHANH</h4>
            <ul className="space-y-1">
              <li>
                <p className="!text-black">Giấy phép</p>
              </li>
              <li>
                <p className="!text-black">Đánh giá</p>
              </li>
              <li>
                <p className="!text-black">Liên hệ</p>
              </li>
              <li>
                <p className="!text-black">Chính sách hỗ trợ</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-2">CÁC LIÊN KẾT KHÁC</h4>
            <ul className="space-y-1">
              <li>
                <p className="!text-black">Về chúng tôi</p>
              </li>
              <li>
                <p className="!text-black">Dự án của chúng tôi</p>
              </li>
              <li>
                <p className="!text-black">Văn phòng của chúng tôi</p>
              </li>
              <li>
                <p className="!text-black">Địa điểm của chúng tôi</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-teal-700 text-white text-center py-3">
      </div>
    </footer>
  );
}
