import Link from "next/link";
import { useRouter } from "next/router";

export default function AgencySidebar() {
  const router = useRouter();
  const linkStyle = "block py-2 px-4 rounded hover:bg-[#e9e5e1]";
  const activeStyle = "bg-[#c2b280] font-semibold";

  return (
    <div className="w-64 h-screen bg-[#f4f1ed] p-6 space-y-4 text-[#234E3F]">
      <h1 className="text-xl font-bold mb-4">Nomore Solo Trip</h1>
      <nav className="space-y-2">
        <Link href="/agency/dashboard" className={`${linkStyle} ${router.pathname === "/agency/dashboard" ? activeStyle : ""}`}>Dashboard</Link>
        <Link href="/agency/requests" className={`${linkStyle} ${router.pathname === "/agency/requests" ? activeStyle : ""}`}>Richieste</Link>
        <Link href="/agency/packages" className={`${linkStyle} ${router.pathname === "/agency/packages" ? activeStyle : ""}`}>Pacchetti</Link>
        <Link href="/agency/stats" className={`${linkStyle} ${router.pathname === "/agency/stats" ? activeStyle : ""}`}>Statistiche</Link>
        <Link href="/agency/profile" className={`${linkStyle} ${router.pathname === "/agency/profile" ? activeStyle : ""}`}>Profilo</Link>
      </nav>
    </div>
  );
}
