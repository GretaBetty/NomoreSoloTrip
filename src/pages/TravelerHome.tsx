// src/pages/TravelerHome.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TravelerHome() {
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#f0e5da] to-[#e7d8cb] text-[#3b2f2f]">
      <header className="bg-[#5c3b1e] text-white p-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">Nomore Solo Trip 🌿</h1>
        <button
          onClick={handleLogout}
          className="bg-[#44634a] hover:bg-[#324c38] text-white px-4 py-2 rounded-xl transition font-semibold"
        >
          Logout
        </button>
      </header>

      <main className="p-8">
        <h2 className="text-4xl font-bold mb-10 text-[#2f1f14]">Benvenuto/a, viaggiatore 🌍</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Link
            to="/chats"
            className="block p-6 border border-[#e0d7c8] rounded-2xl shadow-xl hover:shadow-2xl bg-white hover:bg-[#f6efe7] transition transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold text-[#3e2b1f] mb-2">💬 Chat</h3>
            <p className="text-[#5a4635]">Accedi alle tue chat private o di gruppo e resta in contatto con i tuoi compagni di viaggio.</p>
          </Link>

          <Link
            to="/profile"
            className="block p-6 border border-[#e0d7c8] rounded-2xl shadow-xl hover:shadow-2xl bg-white hover:bg-[#f6efe7] transition transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold text-[#3e2b1f] mb-2">👤 Il tuo profilo</h3>
            <p className="text-[#5a4635]">Aggiorna le tue informazioni personali e scopri chi sei come viaggiatore.</p>
          </Link>

          <Link
            to="/discover"
            className="block p-6 border border-[#e0d7c8] rounded-2xl shadow-xl hover:shadow-2xl bg-white hover:bg-[#f6efe7] transition transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold text-[#3e2b1f] mb-2">🧭 Discover</h3>
            <p className="text-[#5a4635]">Esplora e incontra nuovi viaggiatori con passioni simili alle tue.</p>
          </Link>

          <Link
            to="/packages"
            className="block p-6 border border-[#e0d7c8] rounded-2xl shadow-xl hover:shadow-2xl bg-white hover:bg-[#f6efe7] transition transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-semibold text-[#3e2b1f] mb-2">🎒 Pacchetti viaggio</h3>
            <p className="text-[#5a4635]">Scopri le proposte delle agenzie e trova il pacchetto giusto per il tuo prossimo viaggio.</p>
          </Link>
        </div>
      </main>
    </div>
  );
} 
