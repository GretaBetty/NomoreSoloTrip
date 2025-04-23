import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function EditProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [newTrip, setNewTrip] = useState({ destination: '', description: '', image_url: '' });
  const [trips, setTrips] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const { data: tripsData } = await supabase.from("past_trips").select("*").eq("user_id", user.id);
      setProfile(profileData);
      setForm(profileData);
      setTrips(tripsData || []);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTripChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
  };

  const addTrip = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("past_trips").insert({ ...newTrip, user_id: user.id }).select().single();
    if (!error) {
      setTrips([...trips, data]);
      setNewTrip({ destination: '', description: '', image_url: '' });
    } else {
      alert("Errore nell'aggiunta del viaggio");
    }
  };

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("past_trips").delete().eq("id", id);
    if (!error) setTrips(trips.filter((trip) => trip.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    if (!error) navigate("/my-profile");
    else alert("Errore nel salvataggio del profilo");
  };

  if (!profile) return <p className="p-6 text-center">Caricamento...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modifica Profilo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Nome" className="w-full border p-2 rounded" />
        <input name="surname" value={form.surname || ''} onChange={handleChange} placeholder="Cognome" className="w-full border p-2 rounded" />
        <input name="age" value={form.age || ''} onChange={handleChange} placeholder="Età" type="number" className="w-full border p-2 rounded" />
        <input name="city" value={form.city || ''} onChange={handleChange} placeholder="Città" className="w-full border p-2 rounded" />
        <input name="country" value={form.country || ''} onChange={handleChange} placeholder="Paese" className="w-full border p-2 rounded" />
        <input name="travel_type" value={form.travel_type || ''} onChange={handleChange} placeholder="Tipo di viaggio preferito" className="w-full border p-2 rounded" />
        <input name="favorite_destinations" value={form.favorite_destinations || ''} onChange={handleChange} placeholder="Destinazioni preferite (separate da virgola)" className="w-full border p-2 rounded" />
        <input name="group_size" value={form.group_size || ''} onChange={handleChange} placeholder="Numero ideale di compagni" type="number" className="w-full border p-2 rounded" />
        <textarea name="bio" value={form.bio || ''} onChange={handleChange} placeholder="Bio" className="w-full border p-2 rounded" rows={4} />
        <button type="submit" className="bg-[#44634a] text-white px-4 py-2 rounded-xl hover:bg-[#324c38] transition">Salva</button>
      </form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2">Aggiungi un viaggio passato</h2>
        <div className="space-y-2">
          <input name="destination" value={newTrip.destination} onChange={handleTripChange} placeholder="Destinazione" className="w-full border p-2 rounded" />
          <input name="image_url" value={newTrip.image_url} onChange={handleTripChange} placeholder="URL immagine" className="w-full border p-2 rounded" />
          <textarea name="description" value={newTrip.description} onChange={handleTripChange} placeholder="Descrizione del viaggio" className="w-full border p-2 rounded" rows={3} />
          <button onClick={addTrip} className="bg-[#5c3b1e] text-white px-4 py-2 rounded hover:bg-[#3d2712]">Aggiungi viaggio</button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">I tuoi viaggi</h3>
          {trips.map((trip) => (
            <div key={trip.id} className="border rounded-lg p-4 mb-4">
              <p className="font-bold">{trip.destination}</p>
              <p className="text-sm text-gray-600 mb-2">{trip.description}</p>
              <img src={trip.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
              <button onClick={() => deleteTrip(trip.id)} className="text-sm text-red-600 hover:underline">Elimina</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

<h3 className="text-lg font-semibold mb-6">Immagine profilo</h3>
<div className="flex items-center gap-4 mb-6">
  {form.avatar_url ? (
    <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
  ) : (
    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">N/A</div>
  )}
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const fileName = `${form.id || 'avatar'}-${Date.now()}`;
        const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
          setForm({ ...form, avatar_url: publicUrl });
        } else {
          alert('Errore nel caricamento immagine');
        }
      }
    }}
    className="border p-2 rounded"
  />
</div>

<h3 className="text-lg font-semibold mb-6">Immagine profilo</h3>
<div className="flex items-center gap-4 mb-6">
  {form.avatar_url ? (
    <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
  ) : (
    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">N/A</div>
  )}
  <input
    type="text"
    name="avatar_url"
    value={form.avatar_url || ''}
    onChange={handleChange}
    placeholder="URL immagine profilo"
    className="border p-2 rounded w-full"
  />
</div>



<h3 className="text-lg font-semibold mb-2">I tuoi viaggi</h3>
{trips.map((trip) => (
  <div key={trip.id} className="border rounded-lg p-4 mb-4">
    {trip.editing ? (
      <>
        <input
          type="text"
          value={trip.destination}
          onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, destination: e.target.value } : t))}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          value={trip.image_url}
          onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, image_url: e.target.value } : t))}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          value={trip.description}
          onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, description: e.target.value } : t))}
          className="w-full p-2 border rounded mb-2"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            className="bg-[#44634a] text-white px-4 py-1 rounded"
            onClick={async () => {
              const { error } = await supabase.from("past_trips").update({
                destination: trip.destination,
                image_url: trip.image_url,
                description: trip.description
              }).eq("id", trip.id);
              if (!error) setTrips(trips.map(t => t.id === trip.id ? { ...trip, editing: false } : t));
            }}
          >Salva</button>
          <button
            className="bg-gray-300 px-4 py-1 rounded"
            onClick={() => setTrips(trips.map(t => t.id === trip.id ? { ...trip, editing: false } : t))}
          >Annulla</button>
        </div>
      </>
    ) : (
      <>
        <p className="font-bold">{trip.destination}</p>
        <p className="text-sm text-gray-600 mb-2">{trip.description}</p>
        <img src={trip.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
        <div className="flex gap-4">
          <button onClick={() => setTrips(trips.map(t => t.id === trip.id ? { ...trip, editing: true } : t))} className="text-sm text-blue-600 hover:underline">Modifica</button>
          <button onClick={() => deleteTrip(trip.id)} className="text-sm text-red-600 hover:underline">Elimina</button>
        </div>
      </>
    )}
  </div>
))}


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const translations = {
  it: {
    profilePicture: "Immagine profilo",
    notAvailable: "N/A",
    imageUploadError: "Errore nel caricamento immagine",
    profileImageUrl: "URL immagine profilo"
  },
  en: {
    profilePicture: "Profile picture",
    notAvailable: "N/A",
    imageUploadError: "Error uploading image",
    profileImageUrl: "Profile image URL"
  }
};

export default function EditProfile() {
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const t = translations[lang];

  const [form, setForm] = useState<any>({});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-end mb-4">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as 'it' | 'en')}
          className="border p-1 rounded"
        >
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      <h3 className="text-lg font-semibold mb-6">{t.profilePicture}</h3>
      <div className="flex items-center gap-4 mb-6">
        {form.avatar_url ? (
          <img src={form.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">{t.notAvailable}</div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const fileName = `${form.id || 'avatar'}-${Date.now()}`;
              const { data, error } = await supabase.storage.from('avatars').upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
              });
              if (!error) {
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                setForm({ ...form, avatar_url: publicUrl });
              } else {
                alert(t.imageUploadError);
              }
            }
          }}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          name="avatar_url"
          value={form.avatar_url || ''}
          onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
          placeholder={t.profileImageUrl}
          className="border p-2 rounded w-full"
        />
      </div>
    </div>
  );
}
