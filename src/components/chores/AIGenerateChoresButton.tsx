"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface AIGenerateChoresButtonProps {
  scheduleId: string;
  onGenerated: () => void;
}

export default function AIGenerateChoresButton({
  scheduleId,
  onGenerated,
}: AIGenerateChoresButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/chore-schedules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId }),
      });
      if (res.ok) {
        onGenerated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading ? "Generating..." : "Generate with AI"}
    </Button>
  );
}
