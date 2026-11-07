"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Types
interface MenuItem {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

interface DropdownItem {
  name: string;
  href: string;
}

// Animation variants
const ANIMATIONS: Record<string, Variants> = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  menuContainer: {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  },
  menuItem: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 40, transition: { duration: 0.3 } },
  },
  dropdown: {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", isOpen);
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If we are on an admin route, don't render the main navbar
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => setIsOpen((v: boolean) => !v);
  const toggleDropdown = () => setDropdownOpen((v: boolean) => !v);

  const menuItems: MenuItem[] = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Research", href: "/research" },
    {
      name: "Publications",
      href: "#publications",
      dropdown: [
        { name: "Patent", href: "/publications/patent" },
        { name: "Journal", href: "/publications/journal" },
        { name: "Conference", href: "/publications/conference" },
        { name: "Book Chapter", href: "/publications/bookchapter" },
      ],
    },
    { name: "Courses", href: "/courses" },
    { name: "Events", href: "/events" },
    { name: "Contact Us", href: "#contact" },
    { name: "Gallery", href: "/gallery" },
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.dropdown) {
      setIsOpen(false);
    }
  };

  const handleDropdownItemClick = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.dropdown) {
      return (
        <div key={item.name} className="w-full">
          {/* Publications main item */}
          <motion.div
            variants={ANIMATIONS.menuItem}
            className="text-xl text-white py-2 px-4 rounded-lg"
          >
            {item.name}
          </motion.div>

          {/* Dropdown items with blue line */}
          <div className="ml-6 border-l-2 border-blue-400 pl-4 space-y-2 mt-2">
            {item.dropdown.map((dropdownItem: DropdownItem) => (
              <motion.a
                key={dropdownItem.name}
                href={dropdownItem.href}
                onClick={handleDropdownItemClick}
                className="block text-lg text-white/90 hover:text-blue-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5 relative"
                variants={ANIMATIONS.menuItem}
              >
                {dropdownItem.name}
              </motion.a>
            ))}
          </div>
        </div>
      );
    }

    return (
      <motion.a
        key={item.name}
        href={item.href}
        variants={ANIMATIONS.menuItem}
        className="text-xl text-white hover:text-blue-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5 block w-full"
        onClick={() => handleMenuItemClick(item)}
      >
        {item.name}
      </motion.a>
    );
  };

  return (
    <>
      {/* ---------------- TOP NAVBAR ---------------- */}
      <nav className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-sm z-[60]">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/nitrlogo.png"
              className="rounded-lg cursor-pointer"
              alt="Logo"
              width={50}
              height={50}
            />
          </Link>

          {/* Hamburger / Cross button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className={`flex flex-col justify-center items-center w-12 h-12 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm transition-all
              ${isOpen ? "fixed top-4 right-4 z-[80]" : "relative z-[60]"}`}
          >
            <span
              className={`block w-6 h-0.5 bg-blue-400 mb-1.5 transition-transform ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-blue-400 transition-opacity ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-blue-400 mt-1.5 transition-transform ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ---------------- OVERLAY + RIGHT-SIDE MENU ---------------- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0 bg-gray-900/95 z-40"
              variants={ANIMATIONS.overlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsOpen(false)}
            />

            {/* Sliding panel from the right */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900/95 backdrop-blur-md z-[70] overflow-y-auto"
              variants={ANIMATIONS.menuContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex flex-col items-start px-6 pt-24 pb-8 w-full"
                variants={ANIMATIONS.menuContainer}
              >
                {menuItems.map((item) => renderMenuItem(item))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}