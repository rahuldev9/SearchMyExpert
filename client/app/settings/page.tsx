"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { getUserProfile } from "@/contexts/AuthDetails";
import { showToast } from "@/components/Toast";
import LogoutButton from "@/components/LogoutButton";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "business" | "expert";

  bio?: string;
  location?: string;
  website?: string;

  skills?: string[];
  experience?: number;
  hourlyRate?: number;

  companyName?: string;
  companySize?: string;
  industry?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      setUser(data);
      setForm(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await API.patch("/auth/update-profile", form);

      setUser(res.data.user);
      showToast("Profile updated", "success");
    } catch {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // ================= AVATAR =================

  const handleAvatarSelect = (e: any) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await API.put("/auth/update-avatar", formData);

      setUser((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev));

      showToast("Avatar updated", "success");
    } catch {
      showToast("Avatar upload failed", "error");
    }
  };

  // ================= LOGOUT =================

  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ================= DELETE ACCOUNT =================

  const deleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account?",
    );
    if (!confirmDelete) return;

    try {
      await API.delete("/auth/delete-account");

      localStorage.removeItem("token");

      showToast("Account deleted", "success");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch {
      showToast("Failed to delete account", "error");
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        {/* AVATAR */}

        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            {avatarPreview ? (
              <img src={avatarPreview} className="w-full h-full object-cover" />
            ) : user?.avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xl font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <input type="file" accept="image/*" onChange={handleAvatarSelect} />
            <button
              onClick={uploadAvatar}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Upload Avatar
            </button>
          </div>
        </div>

        {/* NAME */}

        <div className="mb-6">
          <label>Name</label>
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        {/* EMAIL */}

        <div className="mb-6">
          <label>Email</label>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* BIO */}

        <div className="mb-6">
          <label>Bio</label>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        {/* LOCATION */}

        <div className="mb-6">
          <label>Location</label>
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        {/* WEBSITE */}

        <div className="mb-6">
          <label>Website</label>
          <input
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 mt-2"
          />
        </div>

        {/* EXPERT FIELDS */}

        {user?.role === "expert" && (
          <>
            <h2 className="text-xl font-semibold mt-10 mb-4">Expert Profile</h2>

            <div className="mb-6">
              <label>Skills</label>
              <input
                value={form.skills?.join(",") || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    skills: e.target.value.split(","),
                  })
                }
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div className="mb-6">
              <label>Experience</label>
              <input
                name="experience"
                type="number"
                value={form.experience || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div className="mb-6">
              <label>Hourly Rate</label>
              <input
                name="hourlyRate"
                type="number"
                value={form.hourlyRate || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>
          </>
        )}

        {/* BUSINESS FIELDS */}

        {user?.role === "business" && (
          <>
            <h2 className="text-xl font-semibold mt-10 mb-4">Business Info</h2>

            <input
              name="companyName"
              value={form.companyName || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 mb-4"
              placeholder="Company Name"
            />

            <input
              name="companySize"
              value={form.companySize || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 mb-4"
              placeholder="Company Size"
            />

            <input
              name="industry"
              value={form.industry || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="Industry"
            />
          </>
        )}

        {/* SAVE */}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {/* ACCOUNT ACTIONS */}

        <div className="mt-12 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Account Actions</h2>

          <div className="flex gap-4">
            <LogoutButton />

            <button
              onClick={deleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
