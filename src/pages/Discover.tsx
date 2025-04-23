// src/pages/Discover.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Discover() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [filters, setFilters] = useState({ age: '', budget: '', type: '', destination: '' });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/login");

      const { data: users } = await supabase.from("profiles").select("id, name, country, avatar_url, travel_tags, age, budget, destination");
      const { data: groupData } = await supabase.from("groups").select("id, title, destination, trip_type, avg_age, budget_range, members");

      if (users) setProfiles(users);
      if (groupData) setGroups(groupData);
    };

    fetchData();
  }, [navigate]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredProfiles = profiles.filter((p) => {
    return (
      (!filters.age || p.age?.toString() === filters.age) &&
      (!filters.budget || p.budget === filters.budget) &&
      (!filters.type || p.travel_tags?.includes(filters.type)) &&
      (!filters.destination || p.destination === filters.destination || filters.destination === 'any')
    );
  });

  const filteredGroups = groups.filter((g) => {
    return (
      (!filters.age || g.avg_age?.toString() === filters.age) &&
      (!filters.budget || g.budget_range === filters.budget) &&
      (!filters.type || g.trip_type === filters.type) &&
      (!filters.destination || g.destination === filters.destination || filters.destination === 'any')
    );
  });

  const viewProfile = (id: string) => navigate(`/profile/${id}`);
  const viewGroup = (id: string) => navigate(`/group/${id}`);
  const startChat = (id: string) => navigate(`/messages/new?user=${id}`);
  const joinGroup = (id: string) => navigate(`/group/${id}/join`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#f0e5da] to-[#e7d8cb] text-[#3b2f2f]">
      <header className="bg-[#5c3b1e] text-white p-6 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">🔍 Discover</h1>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#2f1f14]">Esplora viaggiatori e gruppi 🌍</h2>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <input name="age" value={filters.age} onChange={handleFilterChange} placeholder="Età" className="p-2 rounded border" />
          <select name="budget" value={filters.budget} onChange={handleFilterChange} className="p-2 rounded border">
            <option value="">Budget</option>
            <option value="low">Basso</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
          </select>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 rounded border">
            <option value="">Tipo di viaggio</option>
            <option value="avventura">Avventura</option>
            <option value="culturale">Culturale</option>
            <option value="mare">Mare</option>
            <option value="relax">Relax</option>
          </select>
          <input name="destination" value={filters.destination} onChange={handleFilterChange} placeholder="Destinazione o 'any'" className="p-2 rounded border" />
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-4">👥 Viaggiatori</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-[#e0d7c8] rounded-2xl p-5 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h3 className="text-xl font-semibold text-[#3b2f2f] cursor-pointer" onClick={() => viewProfile(user.id)}>{user.name}</h3>
                  <p className="text-sm text-[#6b5442]">{user.country}</p>
                </div>
              </div>
              <p className="text-sm text-[#5a4635] italic mb-3">{user.travel_tags?.join(', ') || 'Nessuna preferenza indicata'}</p>
              <button onClick={() => startChat(user.id)} className="mt-2 bg-[#44634a] text-white px-4 py-2 rounded-xl hover:bg-[#324c38] transition w-full">💬 Avvia conversazione</button>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold mt-12 mb-4">👥 Gruppi di viaggio</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-[#e0d7c8] rounded-2xl p-5 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <h4 className="text-xl font-bold text-[#3b2f2f] mb-1 cursor-pointer" onClick={() => viewGroup(group.id)}>{group.title}</h4>
              <p className="text-[#5a4635] mb-1">Destinazione: {group.destination}</p>
              <p className="text-[#5a4635] mb-1">Tipo: {group.trip_type}</p>
              <p className="text-[#5a4635] mb-1">Età media: {group.avg_age}</p>
              <p className="text-[#5a4635]">Budget: {group.budget_range}</p>
              <button onClick={() => joinGroup(group.id)} className="mt-4 bg-[#5c3b1e] text-white px-4 py-2 rounded-xl hover:bg-[#3d2712] transition w-full">🚀 Unisciti al gruppo</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
