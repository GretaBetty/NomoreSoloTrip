import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AgencyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("requests")
        .select("*, groups(title), packages(title)")
        .eq("agency_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(data || []);
    };
    fetchRequests();
  }, []);

  const handleResponse = async (id: string, status: "accepted" | "declined") => {
    await supabase.from("requests").update({ status }).eq("id", id);

    if (status === "accepted") {
      const request = requests.find(r => r.id === id);
      if (!request?.group_id || !request?.agency_id) return;

      const { data: groupData } = await supabase.from("groups").select("admin_id").eq("id", request.group_id).single();
      if (!groupData?.admin_id) return;

      const { data: newConv } = await supabase.from("conversations").insert({ type: "group", group_id: request.group_id }).select().single();

      await supabase.from("conversation_members").insert([
        { conversation_id: newConv.id, user_id: groupData.admin_id },
        { conversation_id: newConv.id, user_id: request.agency_id }
      ]);
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="p-6 bg-[#f9f6f2] min-h-screen">
      <h1 className="text-2xl font-bold text-[#234E3F] mb-6">Richieste ricevute</h1>
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-800">
              <strong>Gruppo:</strong> {req.groups?.title || "-"} <br />
              <strong>Pacchetto richiesto:</strong> {req.packages?.title || "-"} <br />
              <strong>Messaggio:</strong> {req.message} <br />
              <strong>Stato:</strong> <span className={req.status === 'accepted' ? 'text-green-700' : req.status === 'declined' ? 'text-red-600' : 'text-gray-500'}>{req.status}</span>
            {req.status === 'accepted' && (
              <div className="mt-2">
                <a
                  href={`/messages?group_id=${req.group_id}`}
                  className="text-sm text-[#234E3F] underline hover:text-[#0B3D2E]"
                >
                  Vai alla conversazione
                </a>
              </div>
            )
            </p>
            {req.status === "pending" && (
              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => handleResponse(req.id, "accepted")}
                  className="bg-[#44634a] text-white px-4 py-2 rounded"
                >
                  Accetta
                </button>
                <button
                  onClick={() => handleResponse(req.id, "declined")}
                  className="bg-[#5f2e2e] text-white px-4 py-2 rounded"
                >
                  Rifiuta
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
