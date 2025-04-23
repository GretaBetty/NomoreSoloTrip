import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const { data: tripsData } = await supabase.from("past_trips").select("*").eq("user_id", user.id);
      setProfile(profileData);
      setTrips(tripsData || []);
    };
    fetchData();
  }, []);

  if (!profile) return <p className="p-6 text-center">Caricamento profilo...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <img src={profile.avatar_url || '/default-avatar.png'} alt="Avatar" className="w-20 h-20 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold">{profile.name} {profile.surname}</h2>
          <p className="text-gray-600">{profile.city}, {profile.country} — {profile.age} anni</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Preferenze di viaggio</h3>
        <p><strong>Tipo:</strong> {profile.travel_type}</p>
        <p><strong>Destinazioni preferite:</strong> {profile.favorite_destinations?.join(', ')}</p>
        <p><strong>Numero ideale di compagni:</strong> {profile.group_size}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Viaggi passati</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow p-4">
              <img src={trip.image_url || '/default-trip.jpg'} alt={trip.destination} className="w-full h-40 object-cover rounded mb-2" />
              <h4 className="text-lg font-bold">{trip.destination}</h4>
              <p className="text-sm text-gray-600">{trip.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Impostazioni</h3>
        <ul className="list-disc list-inside">
          <li><a href="/edit-profile" className="text-blue-600 hover:underline">Modifica profilo</a></li>
          <li><a href="/settings" className="text-blue-600 hover:underline">Impostazioni generali</a></li>
          <li><a href="/change-password" className="text-blue-600 hover:underline">Cambia password</a></li>
          <li><a href="/logout" className="text-red-600 hover:underline">Logout</a></li>
        </ul>
      </div>
    </div>
  );
}
