import { useNavigate } from "react-router-dom";

export default function AgencyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9f6f2] p-6">
      <h1 className="text-2xl font-bold text-[#234E3F] mb-6">Benvenuto nella tua area agenzia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/agency/packages")}
          className="cursor-pointer p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-[#0B3D2E] mb-2">Pacchetti viaggio</h2>
          <p className="text-sm text-gray-600">Gestisci e crea i pacchetti da offrire ai gruppi.</p>
        </div>

        <div
          onClick={() => navigate("/agency/requests")}
          className="cursor-pointer p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-[#0B3D2E] mb-2">Richieste ricevute</h2>
          <p className="text-sm text-gray-600">Visualizza i gruppi che hanno richiesto informazioni.</p>
        </div>

        <div
          onClick={() => navigate("/agency/profile")}
          className="cursor-pointer p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-[#0B3D2E] mb-2">Profilo agenzia</h2>
          <p className="text-sm text-gray-600">Modifica i tuoi dati e le impostazioni dell’account.</p>
        </div>
      </div>
    </div>
  );
}
