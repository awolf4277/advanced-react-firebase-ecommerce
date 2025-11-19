import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/authContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { UserProfile } from "../types";

const ProfilePage: React.FC = () => {
  const { user, deleteAccount } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          setProfile({
            uid: user.uid,
            email: user.email || "",
            name: "",
            address: "",
            createdAt: Date.now()
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (!user) return <p>You must be logged in to view your profile.</p>;
  if (loading) return <p>Loading profile…</p>;
  if (!profile) return <p>No profile.</p>;

  const handleSave: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        address: profile.address
      });
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete account and all orders?")) return;
    await deleteAccount();
  };

  return (
    <section>
      <h2>Profile</h2>
      <form
        onSubmit={handleSave}
        style={{
          marginTop: "0.75rem",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />
        <input type="email" value={profile.email} disabled />

        {error && <p style={{ color: "#f97373" }}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </form>

      <hr style={{ margin: "1rem 0" }} />

      <button onClick={handleDelete}>Delete Account</button>
    </section>
  );
};

export default ProfilePage;

