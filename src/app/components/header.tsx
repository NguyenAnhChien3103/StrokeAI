"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Login from "./login";
import Register from "./register";
import React from "react";
import { Button } from "react-bootstrap";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalShowLogin, setModalShowLogin] = useState(false);
  const [modalShowRegister, setModalShowRegister] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Register showModalRegister={modalShowRegister} setShowModalRegister={setModalShowRegister} onHide={() => setModalShowRegister(false)} />
      <Login showModalLogin={modalShowLogin} setShowModalLogin={setModalShowLogin} onHide={() => setModalShowLogin(false)} />
      <header className="bg-white shadow-md rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl mx-auto mt-4">
        <Link href="/" className="!no-underline">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="StrokeAI Logo" width={40} height={40} />
            <span className="text-xl font-bold text-cyan-500">StrokeAI</span>
          </div>
        </Link>

        <nav className="hidden md:flex space-x-6 !text-gray-600">
          {[
            { href: "/",  label: "Trang Chủ" },
            { href: "/info", label: "Thông Tin" },
            { href: "/services", label: "Dịch Vụ" },
            { href: "/posts", label: "Bài Viết" },
            { href: "/pages", label: "Các Trang" },
            { href: "/contact", label: "Liên Hệ" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`!no-underline !hover:text-cyan-500 transition ${
                pathname === item.href ? "!text-cyan-500 font-semibold " : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex space-x-4">
          <Button
            variant="none"
            className="px-4 py-2 !rounded-full text-black hover:bg-cyan-500 hover:text-white transition"
            onClick={() => setModalShowRegister(true)}
          >
            Đăng ký
          </Button>
          <button
            className="px-4 py-2 !rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
            onClick={() => setModalShowLogin(true)}
          >
            Đăng nhập
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
            {[
              { href: "/", label: "Trang Chủ" },
              { href: "/info", label: "Thông Tin" },
              { href: "/services", label: "Dịch Vụ" },
              { href: "/posts", label: "Bài Viết" },
              { href: "/pages", label: "Các Trang" },
              { href: "/contact", label: "Liên Hệ" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`!no-underline hover:text-cyan-500 transition ${
                  pathname === item.href ? "text-cyan-500 font-semibold" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="px-4 py-2 !rounded-full border border-cyan-500 text-cyan-500 font-semibold hover:bg-cyan-500 hover:text-white transition"
              onClick={() => {
                setModalShowRegister(true);
                setIsOpen(false);
              }}
            >
              Đăng ký
            </button>
            <button
              className="px-4 py-2 !rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
              onClick={() => {
                setModalShowLogin(true);
                setIsOpen(false);
              }}
            >
              Đăng nhập
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;