import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await supabase.from("groups").select("*").eq("id", id).single();
      setGroup(data);
    };
    fetchGroup();
  }, [id]);

  if (!group) return <p className="p-6 text-center">Caricamento gruppo...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-2">{group.title}</h2>
      <p><strong>Destinazione:</strong> {group.destination}</p>
      <p><strong>Tipo:</strong> {group.trip_type}</p>
      <p><strong>Età media:</strong> {group.avg_age}</p>
      <p><strong>Budget:</strong> {group.budget_range}</p>
      <p className="mt-4">{group.description}</p>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/group/${id}/join`)}
          className="bg-[#5c3b1e] text-white px-4 py-2 rounded-xl hover:bg-[#3d2712] transition"
        >
          🚀 Unisciti al gruppo
        </button>
      </div>
    </div>
  );
}
