import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AgencyPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("packages").select("*").eq("agency_id", user.id);
      setPackages(data || []);
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f6f2] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#234E3F]">I tuoi pacchetti</h1>
        <button
          onClick={() => navigate("/agency/packages/new")}
          className="bg-[#0B3D2E] text-white px-4 py-2 rounded-xl hover:bg-[#092F23]"
        >
          Crea nuovo pacchetto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-[#5F2E2E]">{pkg.title}</h2>
            <p className="text-sm text-gray-600">Destinazione: {pkg.destination}</p>
            <p className="text-sm text-gray-600">Tipo: {pkg.tripType}</p>
            <p className="text-sm text-gray-600">Prezzo: €{pkg.price_per_person}</p>
            <button
              onClick={() => navigate(`/agency/packages/${pkg.id}`)}
              className="mt-3 inline-block bg-[#44634a] text-white px-3 py-1 rounded hover:bg-[#34553a]"
            >
              Modifica o visualizza
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
