import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*" ).eq("id", id).single();
      setProfile(data);
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <p className="p-6 text-center">Caricamento profilo...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-6">
      <img src={profile.avatar_url || '/default-avatar.png'} alt="Avatar" className="w-24 h-24 rounded-full mx-auto" />
      <h2 className="text-center text-2xl font-bold mt-4">{profile.name}</h2>
      <p className="text-center text-gray-600">{profile.country}</p>
      <p className="mt-4">{profile.bio}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Preferenze:</h3>
        <p>{profile.travel_tags?.join(', ')}</p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/messages/new?user=${id}`)}
          className="bg-[#44634a] text-white px-4 py-2 rounded-xl hover:bg-[#324c38] transition"
        >
          💬 Invia messaggio
        </button>
      </div>
    </div>
  );
}
