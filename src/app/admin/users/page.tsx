"use client";
import React, { useState, useEffect } from "react";
import { User, UserRole, UserStatus } from "@/types/user";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("moderator");
  const [status, setStatus] = useState<UserStatus>("active");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("moderator");
    setStatus("active");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Keep blank unless resetting
    setRole(user.role);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this administrator?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete user");
      }
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const userPayload: any = {
      name,
      email,
      role,
      status,
    };
    if (password) userPayload.password = password;

    try {
      const url = editingId ? `/api/users/${editingId}` : "/api/users";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save user");
      }
    } catch {}
    setIsSubmitLoading(false);
  };

  const roleOptions = [
    { label: "Administrator (Full Access)", value: "admin" },
    { label: "Moderator (Listings Access)", value: "moderator" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Administrators</h1>
          <p className="text-sm text-neutral-450">
            Create or manage roles for moderators and admin users.
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm">
          Add User
        </Button>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : users.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-850 rounded-2xl">
          <p className="text-neutral-400">No users found.</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950/20 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-950/10">
                    <td className="py-4 px-6 font-semibold text-white">
                      {u.name}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">{u.email}</td>
                    <td className="py-4 px-6 capitalize font-semibold text-xs text-amber-500">
                      {u.role}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        u.status === "active"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-neutral-800 text-neutral-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="text-xs font-semibold text-neutral-400 hover:text-white px-2.5 py-1 rounded bg-neutral-850 hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-400 px-2.5 py-1 rounded bg-red-950/10 hover:bg-red-950/30 border border-red-900/10 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Admin User" : "Add Admin User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            placeholder="e.g. Ramesh Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="email@khurjadeals.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label={editingId ? "Reset Password" : "Password *"}
            type="password"
            placeholder={editingId ? "Leave blank to keep current" : "••••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!editingId}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role *"
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              required
            />
            <Select
              label="Status *"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-850">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitLoading}>
              Save User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
