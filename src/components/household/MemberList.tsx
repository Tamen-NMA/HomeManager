"use client";

import { useState, useCallback, useEffect } from "react";
import MemberCard from "./MemberCard";
import MemberForm from "./MemberForm";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/providers/ToastProvider";
import type { HouseholdMemberData } from "@/types";

export default function MemberList() {
  const [members, setMembers] = useState<HouseholdMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HouseholdMemberData | undefined>();
  const [deleting, setDeleting] = useState<HouseholdMemberData | undefined>();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { addToast } = useToast();

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/household-members");
    if (res.ok) {
      setMembers(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleSubmit(data: {
    name: string;
    avatar: string;
    age?: number;
    role: string;
  }) {
    const url = editing
      ? `/api/household-members/${editing.id}`
      : "/api/household-members";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      addToast(editing ? "Member updated" : "Member added", "success");
      setShowForm(false);
      setEditing(undefined);
      fetchMembers();
    } else {
      addToast("Failed to save member", "error");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/household-members/${deleting.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      addToast("Member removed", "success");
      setDeleting(undefined);
      fetchMembers();
    } else {
      addToast("Failed to remove member", "error");
    }
    setDeleteLoading(false);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-brown-dark">
            Household Members
          </h1>
          <p className="text-sm text-warm-gray-light">
            Manage your family and household members
          </p>
        </div>
        <Button onClick={() => { setEditing(undefined); setShowForm(true); }}>
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon="👨‍👩‍👧‍👦"
          title="No household members yet"
          description="Add your family members to assign chores and plan meals."
          actionLabel="Add First Member"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onEdit={(member) => { setEditing(member); setShowForm(true); }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(undefined); }}
        title={editing ? "Edit Member" : "Add Member"}
      >
        <MemberForm
          member={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(undefined); }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={handleDelete}
        title="Remove Member"
        message={`Are you sure you want to remove ${deleting?.name}? Their chore assignments will be unassigned.`}
        confirmLabel="Remove"
        loading={deleteLoading}
      />
    </>
  );
}
