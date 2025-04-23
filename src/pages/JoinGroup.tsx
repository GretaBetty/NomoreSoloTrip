import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function JoinGroup() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { error } = await supabase.from("group_members").insert({ group_id: id, user_id: user.id });
      if (!error) {
        navigate(`/group/${id}`);
      } else {
        alert("Errore nell'unione al gruppo.");
      }
    };
    join();
  }, [id, navigate]);

  return <p className="p-6 text-center">Unione al gruppo in corso...</p>;
}