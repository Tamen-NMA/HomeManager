"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { HouseholdMemberData } from "@/types";

interface MemberCardProps {
  member: HouseholdMemberData;
  onEdit: (member: HouseholdMemberData) => void;
  onDelete: (member: HouseholdMemberData) => void;
}

export default function MemberCard({ member, onEdit, onDelete }: MemberCardProps) {
  const roleColors: Record<string, string> = {
    adult: "bg-sage/10 text-sage-dark",
    teen: "bg-terracotta/10 text-terracotta",
    child: "bg-brown/10 text-brown",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-cream-dark bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl">
          {member.avatar || "👤"}
        </span>
        <div>
          <h3 className="font-semibold text-warm-gray">{member.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={roleColors[member.role]}>
              {member.role}
            </Badge>
            {member.age != null && (
              <span className="text-xs text-warm-gray-light">
                Age {member.age}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(member)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
