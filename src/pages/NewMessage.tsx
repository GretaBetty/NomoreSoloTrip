import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function NewMessage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const createOrFetchConversation = async () => {
      if (!userId) return;
      const { data, error } = await supabase.rpc('start_private_conversation', { user_b_id: userId });
      if (!error && data) {
        setConversationId(data.id);
        window.location.href = `/messages/${data.id}`;
      }
    };
    createOrFetchConversation();
  }, [userId]);

  return <p className="p-6 text-center">Caricamento conversazione...</p>;
}
