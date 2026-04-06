import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface DisplayNameModalProps {
  onSave: (name: string) => void;
  isSaving: boolean;
  onSkip: () => void;
}

export function DisplayNameModal({
  onSave,
  isSaving,
  onSkip,
}: DisplayNameModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      onSave(name.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(8, 20, 37, 0.85)",
        backdropFilter: "blur(8px)",
      }}
      data-ocid="displayname.modal"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-full max-w-sm rounded-2xl p-8 shadow-card"
        style={{
          background: "oklch(0.19 0.042 235)",
          border: "1.5px solid oklch(0.72 0.18 193 / 0.5)",
          boxShadow: "0 0 40px oklch(0.72 0.18 193 / 0.15)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: "oklch(0.22 0.07 193)",
            border: "2px solid oklch(0.72 0.18 193)",
          }}
        >
          <User size={28} style={{ color: "oklch(0.72 0.18 193)" }} />
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-1">
          Welcome, Adventurer!
        </h2>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "oklch(0.62 0.04 225)" }}
        >
          Set your display name for the leaderboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={30}
              className="h-11 text-base"
              style={{
                background: "oklch(0.15 0.038 238)",
                borderColor:
                  name.length >= 2
                    ? "oklch(0.72 0.18 193)"
                    : "oklch(0.28 0.04 230)",
                color: "oklch(0.95 0.015 230)",
              }}
              autoFocus
              data-ocid="displayname.input"
            />
            {name.length > 0 && name.length < 2 && (
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.63 0.22 27)" }}
                data-ocid="displayname.error_state"
              >
                Name must be at least 2 characters
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={name.trim().length < 2 || isSaving}
            className="w-full h-11 font-semibold"
            style={{
              background:
                name.trim().length >= 2
                  ? "oklch(0.72 0.18 193)"
                  : "oklch(0.22 0.04 233)",
              color:
                name.trim().length >= 2
                  ? "oklch(0.1 0.03 240)"
                  : "oklch(0.48 0.02 230)",
              border: "none",
            }}
            data-ocid="displayname.submit_button"
          >
            {isSaving ? "Saving..." : "Start Adventure"}
          </Button>

          <button
            type="button"
            onClick={onSkip}
            className="w-full text-sm py-2 transition-colors"
            style={{ color: "oklch(0.48 0.02 230)" }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "oklch(0.62 0.04 225)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "oklch(0.48 0.02 230)";
            }}
            data-ocid="displayname.cancel_button"
          >
            Skip for now
          </button>
        </form>
      </motion.div>
    </div>
  );
}
