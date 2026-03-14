"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { getUserProfile } from "@/contexts/AuthDetails";
import { showToast } from "@/components/Toast";
import LogoutButton from "@/components/LogoutButton";
import { toast } from "sonner";

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
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
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

      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar upload failed");
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

      toast.success("Account deleted");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className=" px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Title */}
            <div className="h-8 w-60 bg-gray-200 rounded mb-8"></div>

            {/* Avatar section */}
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>

              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>

              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>

              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>

              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>

            {/* Save button */}
            <div className="mt-10">
              <div className="h-12 w-full sm:w-48 bg-gray-200 rounded"></div>
            </div>

            {/* Account actions */}
            <div className="mt-12 border-t pt-6 space-y-4">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>

              <div className="flex gap-4">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
                <div className="h-10 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">
            Account Settings
          </h1>

          {/* AVATAR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover"
                />
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

            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="text-sm"
              />

              <button
                onClick={uploadAvatar}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Upload Avatar
              </button>
            </div>
          </div>

          {/* BASIC INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-600 mt-2">{user?.email}</p>
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            {/* WEBSITE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                name="website"
                value={form.website || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>
          </div>

          {/* BIO */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          {/* EXPERT SECTION */}
          {user?.role === "expert" && (
            <>
              <h2 className="text-xl font-semibold mt-10 mb-4">
                Expert Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium">Skills</label>
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

                <div>
                  <label className="text-sm font-medium">Experience</label>
                  <input
                    name="experience"
                    type="number"
                    value={form.experience || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <input
                    name="hourlyRate"
                    type="number"
                    value={form.hourlyRate || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 mt-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* BUSINESS SECTION */}
          {user?.role === "business" && (
            <>
              <h2 className="text-xl font-semibold mt-10 mb-4">
                Business Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  name="companyName"
                  value={form.companyName || ""}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  placeholder="Company Name"
                />

                <input
                  name="companySize"
                  value={form.companySize || ""}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  placeholder="Company Size"
                />

                <input
                  name="industry"
                  value={form.industry || ""}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  placeholder="Industry"
                />
              </div>
            </>
          )}

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-10 w-full sm:w-auto px-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {/* ACCOUNT ACTIONS */}
          <div className="mt-12 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Account Actions</h2>

            <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </DashboardLayout>
  );
}
