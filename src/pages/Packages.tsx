import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Packages() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data } = await supabase.from("packages").select("*");
      if (data) setPackages(data);
    };
    fetchPackages();
  }, []);

  const handleRequest = async (pkgId: string) => {
    const groupId = prompt("Inserisci l'ID del tuo gruppo per richiedere questo pacchetto");
    if (!groupId) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: group, error: groupErr } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .eq("creator_id", user.id)
      .single();
    if (groupErr || !group) return alert("Non sei admin di questo gruppo o l'ID è errato");

    const { error } = await supabase.from("requests").insert({ group_id: groupId, package_id: pkgId, status: "pending" });
    if (error) return alert("Errore nella richiesta");
    alert("Richiesta inviata con successo!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📦 Pacchetti di viaggio disponibili</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
            <p className="mb-1">Destinazione: {pkg.destination}</p>
            <p className="mb-1">Tipo: {pkg.tripType}</p>
            <p className="mb-1">Giorni: {pkg.days}</p>
            <p className="mb-1">Prezzo per persona: €{pkg.price_per_person}</p>
            <a
              className="block text-blue-600 hover:underline mb-2"
              href={pkg.details_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              📄 Dettagli PDF
            </a>
            <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
            <button
              onClick={() => handleRequest(pkg.id)}
              className="mt-4 bg-[#44634a] text-white px-4 py-2 rounded-xl hover:bg-[#324c38] transition w-full"
            >
              📩 Richiedi come gruppo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
