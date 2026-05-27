"use client";

import { useState, useEffect } from "react";
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
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  },

  menuItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.25 },
    },
  },

  dropdown: {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.25,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
};

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "GET",
      });

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

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () =>
      window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.documentElement.classList.toggle(
      "overflow-hidden",
      isOpen
    );

    return () =>
      document.documentElement.classList.remove(
        "overflow-hidden"
      );
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);

    if (isOpen) {
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) =>
      prev === name ? null : name
    );
  };

  const menuItems: MenuItem[] = [
    { name: "Dashboard", href: "/admin" },

    { name: "Team", href: "/admin/team" },

    {
      name: "Research",
      href: "/admin/research",
      dropdown: [
        {
          name: "Research",
          href: "/admin/research",
        },
        {
          name: "Upload Research",
          href: "/admin/uploadResearch",
        },
      ],
    },

    {
      name: "Publications",
      href: "/admin/publications",
      dropdown: [
        {
          name: "Patent",
          href: "/admin/publications/patent",
        },
        {
          name: "Upload Patent",
          href: "/admin/uploadPatents",
        },
        {
          name: "Journal",
          href: "/admin/publications/journal",
        },
        {
          name: "Upload Journal",
          href: "/admin/uploadJournal",
        },
        {
          name: "Conference",
          href: "/admin/publications/conference",
        },
        {
          name: "Upload Conference",
          href: "/admin/uploadConference",
        },
        {
          name: "Book Chapter",
          href: "/admin/publications/bookchapter",
        },
      ],
    },

    { name: "Courses", href: "/admin/courses" },

    { name: "Events", href: "/admin/events" },

    { name: "Gallery", href: "/admin/gallery" },
  ];

  const handleDropdownItemClick = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const renderMenuItem = (
    item: MenuItem,
    isMobile = false
  ) => {
    if (item.dropdown) {
      const isCurrentDropdownOpen =
        openDropdown === item.name;

      // MOBILE
      if (isMobile) {
        return (
          <motion.div
            key={item.name}
            variants={ANIMATIONS.menuItem}
            className="w-full"
          >
            <button
              onClick={() =>
                toggleDropdown(item.name)
              }
              className="w-full flex items-center justify-between text-xl text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span>{item.name}</span>

              <motion.span
                animate={{
                  rotate: isCurrentDropdownOpen
                    ? 180
                    : 0,
                }}
                transition={{ duration: 0.25 }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {isCurrentDropdownOpen && (
                <motion.div
                  variants={ANIMATIONS.dropdown}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="ml-6 border-l-2 border-red-400 pl-4 mt-2 space-y-2">
                    {item.dropdown.map(
                      (dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          onClick={
                            handleDropdownItemClick
                          }
                          className="block text-lg text-white/90 hover:text-red-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5"
                        >
                          {dropdownItem.name}
                        </a>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      }

      // DESKTOP
      return (
        <div
          key={item.name}
          className="relative z-[100]"
        >
          <button
            onClick={() =>
              toggleDropdown(item.name)
            }
            className="text-xl md:text-2xl text-white hover:text-red-300 transition-colors py-2 px-6 rounded-lg hover:bg-white/5 flex items-center gap-2"
          >
            {item.name}

            <motion.span
              animate={{
                rotate: isCurrentDropdownOpen
                  ? 180
                  : 0,
              }}
              transition={{ duration: 0.25 }}
              className="text-sm"
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {isCurrentDropdownOpen && (
              <motion.div
                variants={ANIMATIONS.dropdown}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute left-0 top-full mt-2 min-w-[240px] overflow-hidden rounded-xl border border-red-500/20 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-[200]"
              >
                <div className="py-2">
                  {item.dropdown.map(
                    (dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        onClick={
                          handleDropdownItemClick
                        }
                        className="block px-5 py-3 text-white hover:text-red-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-red-400"
                      >
                        {dropdownItem.name}
                      </a>
                    )
                  )}
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
        onClick={() => {
          setIsOpen(false);
          setOpenDropdown(null);
        }}
        className={`${
          isMobile
            ? "text-xl text-white"
            : "text-xl md:text-2xl text-white"
        } hover:text-red-300 transition-colors py-2 px-4 rounded-lg hover:bg-white/5`}
      >
        {item.name}
      </motion.a>
    );
  };

  return (
    <>
      {/* MOBILE NAV */}
      <nav
        className={`${
          isDesktop ? "hidden" : "block"
        } fixed top-0 left-0 w-full bg-white/20 z-[60]`}
      >
        <div className="flex justify-between items-center h-16 px-4">
          <button
            onClick={() =>
              setIsExitModalOpen(true)
            }
            className="flex items-center gap-3"
          >
            <Image
              src="/nitrlogo.png"
              className="rounded-lg bg-white/10 p-1"
              alt="Logo"
              width={40}
              height={40}
            />

            <span className="text-red-400 font-bold text-lg tracking-wider">
              ADMIN
            </span>
          </button>

          <button
            onClick={toggleMenu}
            className={`flex flex-col justify-center items-center w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm transition-all ${
              isOpen
                ? "fixed top-4 right-4 z-[70]"
                : "relative z-[60]"
            }`}
          >
            <span
              className={`block w-6 h-0.5 bg-red-400 mb-1.5 transition-transform ${
                isOpen
                  ? "rotate-45 translate-y-2"
                  : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-red-400 transition-opacity ${
                isOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block w-6 h-0.5 bg-red-400 mt-1.5 transition-transform ${
                isOpen
                  ? "-rotate-45 -translate-y-2"
                  : ""
              }`}
            />
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-gray-900/95 z-40"
                variants={ANIMATIONS.overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  setIsOpen(false);
                  setOpenDropdown(null);
                }}
              />

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
                  <div className="mb-6 text-red-500 font-bold tracking-widest text-2xl border-b border-red-500/30 pb-2 w-full">
                    ADMIN PANEL
                  </div>

                  {menuItems.map((item) =>
                    renderMenuItem(item, true)
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <div
        className={`${
          isDesktop ? "block" : "hidden"
        }`}
      >
        <div
          className={`fixed top-0 left-0 h-screen w-20 flex flex-col items-center py-6 z-50 ${
            isOpen
              ? "bg-transparent"
              : "bg-white/10 backdrop-blur-lg border-r border-red-500 shadow-xl"
          }`}
        >
          <button
            onClick={() =>
              setIsExitModalOpen(true)
            }
            className="flex flex-col items-center gap-2"
          >
            <Image
              src="/nitrlogo.png"
              className="rounded-lg bg-white/10 p-1"
              alt="Logo"
              width={50}
              height={50}
            />

            {!isOpen && (
              <span className="text-red-400 font-bold text-xs tracking-widest mt-2">
                ADMIN
              </span>
            )}
          </button>

          <div className="flex-1" />

          {!isOpen && (
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-12 h-12 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/30 hover:bg-red-500/20 transition-colors"
            >
              <span className="block w-6 h-0.5 bg-red-400 mb-1.5" />
              <span className="block w-6 h-0.5 bg-red-400" />
              <span className="block w-6 h-0.5 bg-red-400 mt-1.5" />
            </button>
          )}

          <div className="flex-1" />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40"
                variants={ANIMATIONS.overlay}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  setIsOpen(false);
                  setOpenDropdown(null);
                }}
              />

              <motion.div
                className="fixed inset-0 z-50 flex flex-col justify-center items-center"
                variants={ANIMATIONS.menuContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setOpenDropdown(null);
                  }}
                  className="absolute top-6 right-6 text-4xl text-white hover:text-red-400"
                >
                  &times;
                </button>

                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-red-500 font-bold tracking-widest text-3xl">
                  ADMINISTRATION PANEL
                </div>

                <motion.div
                  className="flex flex-wrap items-center justify-center gap-6 max-w-5xl px-4 relative mt-16"
                  variants={ANIMATIONS.menuContainer}
                >
                  {menuItems.map((item) =>
                    renderMenuItem(item)
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* EXIT MODAL */}
      <AnimatePresence>
        {isExitModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setIsExitModalOpen(false)
              }
            />

            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl pointer-events-auto"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  y: 20,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <LogOut className="w-8 h-8 text-red-500" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    Exit Admin Panel?
                  </h3>

                  <p className="text-gray-400 mb-8">
                    Are you sure you want to log
                    out and return to the main
                    site?
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() =>
                        setIsExitModalOpen(false)
                      }
                      className="px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors w-full"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors w-full"
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