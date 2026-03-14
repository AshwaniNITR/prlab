import AdminNavbar from "./components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <div className="lg:pl-20">
        {children}
      </div>
    </>
  );
}
