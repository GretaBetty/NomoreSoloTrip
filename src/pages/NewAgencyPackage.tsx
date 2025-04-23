import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function NewAgencyPackage() {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    tripType: "",
    description: "",
    price_per_person: "",
    duration_days: "",
    pdf_url: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const filename = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("package-pdfs").upload(filename, file);
    if (!error) {
      const url = supabase.storage.from("package-pdfs").getPublicUrl(filename).data.publicUrl;
      setForm(prev => ({ ...prev, pdf_url: url }));
    } else {
      alert("Errore nel caricamento del file PDF");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("packages").insert({
      ...form,
      agency_id: user.id,
      price_per_person: parseFloat(form.price_per_person),
      duration_days: parseInt(form.duration_days)
    });
    if (!error) navigate("/agency/packages");
    else alert("Errore nella creazione del pacchetto");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold text-[#234E3F] mb-4">Crea un nuovo pacchetto viaggio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Titolo" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="destination" placeholder="Destinazione" value={form.destination} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="tripType" placeholder="Tipo di viaggio (es. avventura, relax...)" value={form.tripType} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="duration_days" placeholder="Durata (giorni)" value={form.duration_days} onChange={handleChange} className="w-full p-2 border rounded" type="number" />
        <input name="price_per_person" placeholder="Prezzo a persona (€)" value={form.price_per_person} onChange={handleChange} className="w-full p-2 border rounded" type="number" />
        <textarea name="description" placeholder="Descrizione dettagliata" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4} />
        <label className="block text-sm text-gray-600">Carica PDF descrizione viaggio</label>
        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="w-full" />
        <button type="submit" className="bg-[#0B3D2E] text-white px-4 py-2 rounded">Salva pacchetto</button>
      </form>
    </div>
  );
}
