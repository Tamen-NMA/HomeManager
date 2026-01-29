"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { MEMBER_AVATARS, MEMBER_ROLES } from "@/lib/constants";
import type { HouseholdMemberData } from "@/types";

interface MemberFormProps {
  member?: HouseholdMemberData;
  onSubmit: (data: {
    name: string;
    avatar: string;
    age?: number;
    role: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [name, setName] = useState(member?.name || "");
  const [avatar, setAvatar] = useState(member?.avatar || MEMBER_AVATARS[0]);
  const [age, setAge] = useState(member?.age?.toString() || "");
  const [role, setRole] = useState(member?.role || "adult");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        avatar,
        age: age ? parseInt(age) : undefined,
        role,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Member name"
        required
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-warm-gray">Avatar</label>
        <div className="flex flex-wrap gap-2">
          {MEMBER_AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
                avatar === a
                  ? "bg-terracotta/10 ring-2 ring-terracotta"
                  : "bg-cream hover:bg-cream-dark"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Age (optional)"
        id="age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        min={0}
        max={120}
      />

      <Select
        label="Role"
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={MEMBER_ROLES.map((r) => ({
          value: r,
          label: r.charAt(0).toUpperCase() + r.slice(1),
        }))}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Saving..." : member ? "Update" : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
