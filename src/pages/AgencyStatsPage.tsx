import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AgencyStatsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [groupSizes, setGroupSizes] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const destRes = await supabase.rpc("top_destinations_by_agency", { agencyid: user.id });
      setDestinations(destRes.data || []);

      const budgetRes = await supabase.rpc("average_budget_by_agency", { agencyid: user.id });
      setBudgets(budgetRes.data || []);

      const sizeRes = await supabase.rpc("group_size_distribution", { agencyid: user.id });
      setGroupSizes(sizeRes.data || []);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-[#f9f6f2] min-h-screen">
      <h1 className="text-2xl font-bold text-[#234E3F] mb-6">Statistiche dell'agenzia</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-[#0B3D2E]">Destinazioni più richieste</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={destinations}>
            <XAxis dataKey="destination" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#5F2E2E" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-[#0B3D2E]">Spesa media a persona (€)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgets}>
            <XAxis dataKey="trip_type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="average_budget" fill="#44634a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#0B3D2E]">Distribuzione delle dimensioni dei gruppi</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={groupSizes}>
            <XAxis dataKey="size_range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B4513" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
