import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AgencyProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      setFormData(data);
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    await supabase.from("profiles").update(formData).eq("id", profile.id);
    setProfile(formData);
    setEditing(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const updatePassword = async () => {
    if (newPassword.trim().length < 6) {
      alert("La password deve contenere almeno 6 caratteri.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert("Errore nel cambio password: " + error.message);
    else {
      alert("Password aggiornata con successo.");
      setNewPassword("");
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.");
    if (!confirmDelete) return;

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").delete().eq("id", user.id);
    if (!error) {
      await supabase.auth.signOut();
      alert("Account eliminato con successo.");
      window.location.href = "/";
    } else {
      alert("Errore durante l'eliminazione dell'account: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-[#f9f6f2] min-h-screen">
      <h1 className="text-2xl font-bold text-[#234E3F] mb-6">Profilo Agenzia</h1>

      {editing ? (
        <div className="space-y-4">
          <input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nome agenzia"
          />
          <input
            value={formData.website || ""}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Sito web"
          />
          <textarea
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Descrizione dell'agenzia"
          />
          <button onClick={updateProfile} className="bg-[#44634a] text-white px-4 py-2 rounded">
            Salva modifiche
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><strong>Nome:</strong> {profile.name}</p>
          <p><strong>Sito:</strong> {profile.website}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <button onClick={() => setEditing(true)} className="bg-[#234E3F] text-white px-4 py-2 rounded">
            Modifica profilo
          </button>
        </div>
      )}

      <hr className="my-6" />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Impostazioni account</h2>

        <div className="space-y-2">
          <input
            type="password"
            placeholder="Nuova password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button onClick={updatePassword} className="bg-[#0B3D2E] text-white px-4 py-2 rounded">
            Cambia password
          </button>
        </div>

        <button onClick={logout} className="bg-[#5f2e2e] text-white px-4 py-2 rounded">
          Logout
        </button>

        <button onClick={deleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
          Elimina account
        </button>
      </div>
    </div>
  );
}
