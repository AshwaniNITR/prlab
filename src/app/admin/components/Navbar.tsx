"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
const ANIMATIONS = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  menuContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  },
  menuItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  },
  dropdown: {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    },
  },
};

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (res.ok) {
        setIsExitModalOpen(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1500);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen((v: boolean) => !v);
  const toggleDropdown = () => setDropdownOpen((v: boolean) => !v);

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Team", href: "/admin/team" },
    { name: "Research", href: "/admin/research" },
    { 
      name: "Publications", 
      href: "/admin/publications",
      dropdown: [
        { name: "Patent", href: "/admin/publications/patent" },
        { name: "Journal", href: "/admin/publications/journal" },
        { name: "Conference", href: "/admin/publications/conference" },
        { name: "Book Chapter", href: "/admin/publications/bookchapter" },
      ]
    },
    { name: "Courses", href: "/admin/courses" },
    { name: "Events", href: "/admin/events" },
    { name: "Gallery", href: "/admin/gallery" },
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

  const renderMenuItem = (item: MenuItem, isMobile: boolean = false) => {
    if (item.dropdown) {
      if (isMobile) {
        // Mobile: Always expanded with red line for admin
        return (
          <div key={item.name} className="w-full">
            {/* Publications main item */}
            <motion.div
              variants={ANIMATIONS.menuItem}
              className="text-xl text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              {item.name}
            </motion.div>
            
            {/* Dropdown items with red line */}
            <div className="ml-6 border-l-2 border-red-400 pl-4 space-y-2 mt-2">
              {item.dropdown.map((dropdownItem: DropdownItem) => (
                <motion.a
                  key={dropdownItem.name}
                  href={dropdownItem.href}
                  onClick={handleDropdownItemClick}
                  className="block text-lg text-white/90 hover:text-red-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5 relative"
                  variants={ANIMATIONS.menuItem}
                >
                  {dropdownItem.name}
                </motion.a>
              ))}
            </div>
          </div>
        );
      }

      // Desktop: Collapsible dropdown
      return (
        <div key={item.name} className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-xl md:text-2xl text-white hover:text-red-300 transition-colors py-2 px-6 rounded-lg hover:bg-white/5 flex items-center gap-2"
          >
            {item.name}
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              ▼
            </motion.span>
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={ANIMATIONS.dropdown}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 top-full mt-1 bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden min-w-[200px] border-l-4 border-red-500"
              >
                <div className="py-2">
                  {item.dropdown.map((dropdownItem: DropdownItem) => (
                    <a
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      onClick={handleDropdownItemClick}
                      className="block text-white hover:text-red-300 transition-colors py-3 px-6 hover:bg-white/5 border-l-2 border-red-400/50 ml-2"
                    >
                      {dropdownItem.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.a
        key={item.name}
        href={item.href}
        variants={ANIMATIONS.menuItem}
        className={`${isMobile ? 'text-xl text-white' : 'text-xl md:text-2xl text-white'} hover:text-red-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5`}
        onClick={() => handleMenuItemClick(item)}
      >
        {item.name}
      </motion.a>
    );
  };

  return (
    <>
      {/* ---------------- MOBILE NAV (Below 1500px) ---------------- */}
      <nav className={`${isDesktop ? 'hidden' : 'block'} fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md z-[60] border-b border-red-500/20`}>
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo with Admin label */}
          <button 
            onClick={() => setIsExitModalOpen(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer text-left"
            title="Exit Admin Panel"
          >
            <Image src="/nitrlogo.png" className="rounded-lg bg-white/10 p-1" alt="Logo" width={40} height={40} />
            <span className="text-red-400 font-bold text-lg tracking-wider">ADMIN</span>
          </button>

          {/* Hamburger / Cross button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className={`flex flex-col justify-center items-center w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm transition-all
              ${isOpen ? "fixed top-4 right-4 z-[70]" : "relative z-[60]"}`}
          >
            <span
              className={`block w-6 h-0.5 bg-red-400 mb-1.5 transition-transform ${
                isOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-red-400 transition-opacity ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-red-400 mt-1.5 transition-transform ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Overlay + Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dark overlay behind button */}
              <motion.div
                className="fixed inset-0 bg-white/10 z-40"
                variants={ANIMATIONS.overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsOpen(false)}
              />
              {/* Menu layer */}
              <motion.div
                className="fixed inset-0 z-50 flex flex-col justify-center items-center"
                variants={ANIMATIONS.menuContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="flex flex-col items-start px-6 w-full max-w-sm"
                  variants={ANIMATIONS.menuContainer}
                >
                  <div className="mb-6 text-red-500 font-bold tracking-widest text-2xl border-b border-red-500/30 pb-2 w-full">ADMIN PANEL</div>
                  {menuItems.map((item) => renderMenuItem(item, true))}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* ---------------- DESKTOP SIDEBAR (1500px and above) ---------------- */}
      <div className={`${isDesktop ? 'block' : 'hidden'}`}>
        <div
          className={`fixed top-0 left-0 h-screen w-20 flex flex-col items-center py-6 z-50 
          ${
            isOpen
              ? "bg-transparent"
              : "bg-white/10 backdrop-blur-lg border-r border-red-500 shadow-xl"
          }`}
        >
          {/* Logo with Admin label */}
          <button 
            onClick={() => setIsExitModalOpen(true)}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
            title="Exit Admin Panel"
          >
            <Image src="/nitrlogo.png" className="rounded-lg bg-white/10 p-1" alt="Logo" width={50} height={50} />
            {!isOpen && <span className="text-red-400 font-bold text-xs tracking-widest mt-2">ADMIN</span>}
          </button>
          
          <div className="flex-1" />
          
          {/* Desktop hamburger */}
          {!isOpen && (
            <button
              onClick={toggleMenu}
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="flex flex-col justify-center items-center w-12 h-12 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/20 transition-colors"
            >
              <span className="block w-6 h-0.5 bg-red-400 mb-1.5" />
              <span className="block w-6 h-0.5 bg-red-400" />
              <span className="block w-6 h-0.5 bg-red-400 mt-1.5" />
            </button>
          )}

          <div className="flex-1" />
        </div>

        {/* Overlay + Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40"
                variants={ANIMATIONS.overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                className="fixed inset-0 z-50 flex flex-col justify-center items-center"
                variants={ANIMATIONS.menuContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Desktop cross at top-right only */}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="absolute top-6 right-6 text-4xl text-white z-[60] hover:text-red-400 transition-colors"
                >
                  &times;
                </button>

                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-red-500 font-bold tracking-widest text-3xl">
                  ADMINISTRATION PANEL
                </div>

                <motion.div
                  className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-6 max-w-4xl px-4 relative mt-16"
                  variants={ANIMATIONS.menuContainer}
                >
                  {menuItems.map((item) => renderMenuItem(item))}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- EXIT CONFIRMATION MODAL ---------------- */}
      <AnimatePresence>
        {isExitModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExitModalOpen(false)}
            />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl pointer-events-auto"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <LogOut className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Exit Admin Panel?</h3>
                  <p className="text-gray-400 mb-8">
                    Are you sure you want to log out and return to the main site?
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => setIsExitModalOpen(false)}
                      className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors w-full border border-gray-700 hover:border-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors w-full shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
