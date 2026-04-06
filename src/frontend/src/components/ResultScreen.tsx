import { Button } from "@/components/ui/button";
import { ChevronRight, Frown, RotateCcw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import type { Level, SubmissionResult } from "../backend";

const TOTAL_QUESTIONS = 5;

interface ResultScreenProps {
  level: Level;
  result: SubmissionResult;
  onContinue: () => void;
  onReplay: () => void;
  isResetting: boolean;
}

export function ResultScreen({
  level,
  result,
  onContinue,
  onReplay,
  isResetting,
}: ResultScreenProps) {
  const correct = Number(result.correctAnswers);
  const passed = result.passed;
  const newLevel = Number(result.newLevel);
  const scoreEarned = Number(result.score);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.10 0.035 245), oklch(0.13 0.038 238))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
        className="w-full max-w-md"
        data-ocid="result.card"
      >
        {/* Result card */}
        <div
          className="rounded-2xl p-8 shadow-card text-center"
          style={{
            background: "oklch(0.19 0.042 235)",
            border: passed
              ? "1.5px solid oklch(0.73 0.18 152 / 0.6)"
              : "1.5px solid oklch(0.63 0.22 27 / 0.5)",
            boxShadow: passed
              ? "0 0 40px oklch(0.73 0.18 152 / 0.15)"
              : "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          {/* Big icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-5"
          >
            {passed ? (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.07 152)",
                  border: "3px solid oklch(0.73 0.18 152)",
                  boxShadow: "0 0 32px oklch(0.73 0.18 152 / 0.5)",
                }}
              >
                <Trophy size={44} style={{ color: "oklch(0.80 0.16 75)" }} />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.07 27)",
                  border: "3px solid oklch(0.63 0.22 27)",
                }}
              >
                <Frown size={44} style={{ color: "oklch(0.63 0.22 27)" }} />
              </div>
            )}
          </motion.div>

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h1
              className="text-3xl font-bold mb-1"
              style={{
                color: passed
                  ? "oklch(0.73 0.18 152)"
                  : "oklch(0.85 0.015 230)",
              }}
            >
              {passed ? "Level Complete! 🎉" : "Almost There!"}
            </h1>
            <p
              className="text-sm mb-6"
              style={{ color: "oklch(0.62 0.04 225)" }}
            >
              {passed
                ? `You've unlocked Level ${newLevel}!`
                : "Keep going! You can do it!"}
            </p>
          </motion.div>

          {/* Score breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-xl p-5 mb-6"
            style={{ background: "oklch(0.15 0.038 238)" }}
          >
            <div className="flex justify-around">
              <div className="text-center">
                <p
                  className="text-4xl font-bold"
                  style={{
                    color: passed
                      ? "oklch(0.73 0.18 152)"
                      : "oklch(0.63 0.22 27)",
                  }}
                >
                  {correct}/{TOTAL_QUESTIONS}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.62 0.04 225)" }}
                >
                  Correct Answers
                </p>
              </div>
              <div
                className="w-px"
                style={{ background: "oklch(0.28 0.04 230)" }}
              />
              <div className="text-center">
                <p
                  className="text-4xl font-bold"
                  style={{ color: "oklch(0.80 0.16 75)" }}
                >
                  +{scoreEarned}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.62 0.04 225)" }}
                >
                  Points Earned
                </p>
              </div>
            </div>

            {/* Answer bars */}
            <div className="flex gap-1.5 mt-4 justify-center">
              {(["q1", "q2", "q3", "q4", "q5"] as const).map((barKey, i) => (
                <motion.div
                  key={barKey}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  className="flex-1 h-2 rounded-full"
                  style={{
                    background:
                      i < correct
                        ? "oklch(0.73 0.18 152)"
                        : "oklch(0.28 0.04 230)",
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
            <div
              className="flex justify-between text-xs mt-1"
              style={{ color: "oklch(0.48 0.02 230)" }}
            >
              <span>0</span>
              <span>Pass: 3/5</span>
              <span>5</span>
            </div>
          </motion.div>

          {/* Level name */}
          <p className="text-sm mb-6" style={{ color: "oklch(0.62 0.04 225)" }}>
            {level.name} — {level.theme}
          </p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            {passed ? (
              <>
                {newLevel <= 5 && (
                  <Button
                    onClick={onContinue}
                    className="w-full h-12 text-base font-semibold gap-2"
                    style={{
                      background: "oklch(0.73 0.18 152)",
                      color: "oklch(0.1 0.03 240)",
                      border: "none",
                    }}
                    data-ocid="result.primary_button"
                  >
                    Continue to Level {newLevel}
                    <ChevronRight size={18} />
                  </Button>
                )}
                <Button
                  onClick={onReplay}
                  disabled={isResetting}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold gap-2"
                  style={{
                    background: "transparent",
                    borderColor: "oklch(0.72 0.18 193)",
                    color: "oklch(0.72 0.18 193)",
                  }}
                  data-ocid="result.secondary_button"
                >
                  <RotateCcw size={16} />
                  {isResetting ? "Resetting..." : "Replay Level"}
                </Button>
              </>
            ) : (
              <Button
                onClick={onReplay}
                disabled={isResetting}
                className="w-full h-12 text-base font-semibold gap-2"
                style={{
                  background: "oklch(0.72 0.18 193)",
                  color: "oklch(0.1 0.03 240)",
                  border: "none",
                }}
                data-ocid="result.primary_button"
              >
                <RotateCcw size={16} />
                {isResetting ? "Resetting..." : "Try Again"}
              </Button>
            )}

            <Button
              onClick={onContinue}
              variant="ghost"
              className="w-full text-sm"
              style={{ color: "oklch(0.62 0.04 225)" }}
              data-ocid="result.link"
            >
              Back to Map
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
