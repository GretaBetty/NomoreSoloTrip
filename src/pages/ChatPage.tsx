import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user.id);
      const { data } = await supabase.from("conversation_members")
        .select("*, conversations(*)")
        .eq("user_id", user.id);
      const convList = data.map((d: any) => d.conversations);
      setConversations(convList);
    };
    fetchUserAndConversations();
  }, []);

  const queryParams = new URLSearchParams(location.search);
const groupIdFromURL = queryParams.get("group_id");
if (groupIdFromURL) {
  const convMatch = convList.find(c => c.group_id === groupIdFromURL);
  if (convMatch) setSelectedConv(convMatch);
}

  useEffect(() => {
    if (!selectedConv) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages")
        .select("*")
        .eq("conversation_id", selectedConv.id)
        .order("timestamp", { ascending: true });
      setMessages(data);
    };
    fetchMessages();

    const fetchParticipants = async () => {
      const { data } = await supabase.from("conversation_members")
        .select("user_id, profiles(name, avatar_url)")
        .eq("conversation_id", selectedConv.id);
      setParticipants(data);
    };
    fetchParticipants();

    const channel = supabase.channel(`conversation-${selectedConv.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${selectedConv.id}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConv]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || !userId) return;
    await supabase.from("messages").insert({
      conversation_id: selectedConv.id,
      sender_id: userId,
      content: newMessage
    });
    setNewMessage("");
  };

  const startNewPrivateChat = async (targetUserId: string) => {
    if (!userId || userId === targetUserId) return;
    const { data: existing } = await supabase.from("conversations")
      .select("id")
      .eq("type", "private")
      .in("id", supabase.from("conversation_members")
        .select("conversation_id")
        .eq("user_id", userId)
        .then(res => res.data?.map((m: any) => m.conversation_id) || []))
      .in("id", supabase.from("conversation_members")
        .select("conversation_id")
        .eq("user_id", targetUserId)
        .then(res => res.data?.map((m: any) => m.conversation_id) || []));

    if (existing?.length) {
      const convId = existing[0].id;
      const { data } = await supabase.from("conversations").select("*").eq("id", convId).single();
      setSelectedConv(data);
      return;
    }

    const { data: newConv } = await supabase.from("conversations").insert({ type: "private" }).select().single();
    await supabase.from("conversation_members").insert([
      { conversation_id: newConv.id, user_id: userId },
      { conversation_id: newConv.id, user_id: targetUserId },
    ]);
    setSelectedConv(newConv);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold p-4">Conversazioni</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConv(conv)}
            className={`p-4 cursor-pointer ${selectedConv?.id === conv.id ? 'bg-[#f4f1ed]' : ''}`}
          >
            {conv.type === "private" ? "Chat privata" : `Gruppo: ${conv.group_id || ''}`}
          </div>
        ))}
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        {selectedConv && (
          <>
            <div className="pb-4 border-b mb-4">
              <h3 className="text-lg font-bold">
                {selectedConv.type === 'private'
                  ? participants.find(p => p.user_id !== userId)?.profiles?.name || 'Utente'
                  : `Gruppo: ${selectedConv.group_id}`}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-[75%] ${msg.sender_id === userId ? 'bg-[#e6f2ea] self-end' : 'bg-[#f3f3f3]'}`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="border rounded p-2 flex-1"
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-[#44634a] text-white px-4 py-2 rounded"
              >
                Invia
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
