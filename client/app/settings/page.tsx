"use client";

import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/lib/api";
import { getUserProfile } from "@/contexts/AuthDetails";
import LogoutButton from "@/components/LogoutButton";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPic?: string;
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

  followers?: any[];
  following?: any[];

  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;

  rating?: number;
  totalReviews?: number;

  isVerified?: boolean;
  isActive?: boolean;

  createdAt?: string;
}

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);

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

    const reader = new FileReader();

    reader.readAsDataURL(avatarFile);

    reader.onloadend = async () => {
      try {
        const res = await API.put("/auth/update-avatar", {
          avatar: reader.result,
        });

        setUser((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev));

        toast.success("Avatar updated");
      } catch {
        toast.error("Avatar upload failed");
      }
    };
  };

  // ================= COVER =================

  const handleCoverSelect = (e: any) => {
    const file = e.target.files[0];

    setCoverFile(file);

    setCoverPreview(URL.createObjectURL(file));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);

      reader.onerror = (error) => reject(error);
    });
  };

  const uploadCover = async () => {
    if (!coverFile) return;

    try {
      const base64Image = await convertToBase64(coverFile);

      const res = await API.put("/auth/update-cover", {
        cover: base64Image,
      });

      setUser((prev) =>
        prev ? { ...prev, coverPic: res.data.coverPic } : prev,
      );

      toast.success("Cover updated");
    } catch (error) {
      toast.error("Cover upload failed");
    }
  };

  // ================= DELETE ACCOUNT =================

  const deleteAccount = async () => {
    const confirmDelete = confirm("Delete your account?");

    if (!confirmDelete) return;

    try {
      await API.delete("/auth/delete-account");

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      window.location.href = "/";
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="m-4">
        {/* COVER + PROFILE HEADER */}

        <div className="relative">
          {/* COVER IMAGE */}

          <div className="relative w-full h-60 md:h-72 bg-gray-200 overflow-hidden">
            {/* Hidden input */}

            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={handleCoverSelect}
              className="hidden"
            />

            {/* Cover image */}

            <div
              onClick={() => coverInputRef.current?.click()}
              className="w-full h-full cursor-pointer group"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  className="w-full h-full object-cover"
                />
              ) : user?.coverPic ? (
                <img
                  src={
                    user.coverPic.startsWith("data:")
                      ? user.coverPic
                      : user.coverPic.startsWith("http")
                        ? user.coverPic
                        : `${process.env.NEXT_PUBLIC_BACKEND_API}${user.coverPic}`
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No Cover
                </div>
              )}

              {/* Hover overlay */}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                Change Cover
              </div>
            </div>

            {/* Upload button */}

            {coverFile && (
              <button
                onClick={uploadCover}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
              >
                Upload Cover
              </button>
            )}
          </div>

          {/* PROFILE HEADER */}

          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-16">
              {/* AVATAR */}

              <div className="flex flex-col items-center sm:items-start gap-3">
                {/* Hidden File Input */}

                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={handleAvatarSelect}
                  className="hidden"
                />

                {/* Avatar */}

                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg cursor-pointer group"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith("data:")
                          ? user.avatar
                          : user.avatar.startsWith("http")
                            ? user.avatar
                            : `${process.env.NEXT_PUBLIC_BACKEND_API}${user.avatar}`
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl sm:text-2xl font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}

                  {/* Hover overlay */}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs sm:text-sm transition">
                    Change Photo
                  </div>
                </div>

                {/* Upload Button */}

                {avatarFile && (
                  <button
                    onClick={uploadAvatar}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-2 rounded"
                  >
                    Upload Avatar
                  </button>
                )}
              </div>

              {/* USER INFO */}

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>

                <p className="text-gray-600 text-sm sm:text-base">
                  {user?.bio}
                </p>

                {/* STATS */}

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mt-2 text-sm">
                  <span>
                    <b>{user?.followers?.length || 0}</b> Followers
                  </span>

                  <span>
                    <b>{user?.following?.length || 0}</b> Following
                  </span>

                  <span>
                    <b>{user?.totalProjects || 0}</b> Projects
                  </span>
                </div>

                {user?.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-blue-600 text-sm block mt-2"
                  >
                    {user.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE EDIT */}

        <div className="bg-white rounded-xl shadow p-6 mt-8 mx-4">
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Name"
              className="border p-3 rounded"
            />

            <input
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              placeholder="Location"
              className="border p-3 rounded"
            />

            <input
              name="website"
              value={form.website || ""}
              onChange={handleChange}
              placeholder="Website"
              className="border p-3 rounded"
            />
          </div>

          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
            className="border p-3 rounded w-full mt-6"
          />

          {/* BUSINESS SECTION */}

          {user?.role === "business" && (
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <input
                name="companyName"
                value={form.companyName || ""}
                onChange={handleChange}
                placeholder="Company Name"
                className="border p-3 rounded"
              />

              <input
                name="companySize"
                value={form.companySize || ""}
                onChange={handleChange}
                placeholder="Company Size"
                className="border p-3 rounded"
              />

              <input
                name="industry"
                value={form.industry || ""}
                onChange={handleChange}
                placeholder="Industry"
                className="border p-3 rounded"
              />
            </div>
          )}

          {/* SAVE BUTTON */}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-4">
          <Stat title="Projects" value={user?.totalProjects} />

          <Stat title="Active" value={user?.activeProjects} />

          <Stat title="Completed" value={user?.completedProjects} />

          <Stat title="Rating" value={user?.rating || 0} />
        </div>

        {/* ACCOUNT ACTIONS */}

        <div className="mt-10 border-t pt-6 flex gap-4 px-4">
          <LogoutButton />

          <button
            onClick={deleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>

      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
