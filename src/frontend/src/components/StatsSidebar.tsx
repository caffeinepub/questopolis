import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Medal, Target, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { LeaderboardEntry, PlayerProgress } from "../backend";

interface StatsSidebarProps {
  progress: PlayerProgress | null | undefined;
  leaderboard: LeaderboardEntry[] | undefined;
  isLoadingProgress: boolean;
  isLoadingLeaderboard: boolean;
  currentLevel: number;
}

function getRank(score: bigint): string {
  const s = Number(score);
  if (s >= 2000) return "Grandmaster";
  if (s >= 1000) return "Expert";
  if (s >= 500) return "Journeyman";
  if (s >= 200) return "Apprentice";
  return "Novice";
}

function getRankColor(rank: string): string {
  switch (rank) {
    case "Grandmaster":
      return "oklch(0.80 0.16 75)";
    case "Expert":
      return "oklch(0.72 0.18 193)";
    case "Journeyman":
      return "oklch(0.73 0.18 152)";
    case "Apprentice":
      return "oklch(0.75 0.18 55)";
    default:
      return "oklch(0.62 0.04 225)";
  }
}

export function StatsSidebar({
  progress,
  leaderboard,
  isLoadingProgress,
  isLoadingLeaderboard,
  currentLevel,
}: StatsSidebarProps) {
  const score = progress ? Number(progress.totalScore) : 0;
  const streak = progress ? Number(progress.streak) : 0;
  const levelsCompleted = Math.max(0, currentLevel - 1);
  const rank = getRank(BigInt(score));

  const stats = [
    {
      label: "Score",
      value: score.toLocaleString(),
      icon: Trophy,
      color: "oklch(0.80 0.16 75)",
    },
    {
      label: "Levels Done",
      value: `${levelsCompleted}/5`,
      icon: Target,
      color: "oklch(0.72 0.18 193)",
    },
    {
      label: "Rank",
      value: rank,
      icon: Medal,
      color: getRankColor(rank),
    },
    {
      label: "Streak",
      value: `${streak} 🔥`,
      icon: Flame,
      color: "oklch(0.75 0.18 55)",
    },
  ];

  const skeletonKeys = ["sk1", "sk2", "sk3", "sk4"];
  const leaderSkeletonKeys = ["lsk1", "lsk2", "lsk3", "lsk4", "lsk5"];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Current Stats Card */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="card-game p-5 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} style={{ color: "oklch(0.72 0.18 193)" }} />
          <h3 className="text-base font-semibold text-white">Current Stats</h3>
        </div>

        {isLoadingProgress ? (
          <div className="space-y-3">
            {skeletonKeys.map((key) => (
              <Skeleton
                key={key}
                className="h-12 w-full rounded-lg"
                style={{ background: "oklch(0.24 0.04 232)" }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="card-panel p-3 text-center"
                data-ocid="stats.card"
              >
                <stat.icon
                  size={16}
                  className="mx-auto mb-1"
                  style={{ color: stat.color }}
                />
                <p className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.62 0.04 225)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Leaderboard Card */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="card-game p-5 shadow-card flex-1"
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={18} style={{ color: "oklch(0.80 0.16 75)" }} />
          <h3 className="text-base font-semibold text-white">Leaderboard</h3>
        </div>

        {isLoadingLeaderboard ? (
          <div className="space-y-2">
            {leaderSkeletonKeys.map((key) => (
              <Skeleton
                key={key}
                className="h-10 w-full rounded-lg"
                style={{ background: "oklch(0.24 0.04 232)" }}
              />
            ))}
          </div>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <div className="text-center py-6" data-ocid="leaderboard.empty_state">
            <Trophy
              size={32}
              className="mx-auto mb-2"
              style={{ color: "oklch(0.35 0.02 230)" }}
            />
            <p className="text-sm" style={{ color: "oklch(0.48 0.02 230)" }}>
              No scores yet.
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.40 0.02 230)" }}
            >
              Be the first to play!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 8).map((entry, idx) => (
              <div
                key={entry.player.toString()}
                className="flex items-center gap-3 px-3 py-2 rounded-lg"
                style={{
                  background:
                    idx === 0
                      ? "oklch(0.22 0.06 75 / 0.3)"
                      : "oklch(0.22 0.03 232)",
                  border:
                    idx === 0
                      ? "1px solid oklch(0.80 0.16 75 / 0.4)"
                      : "1px solid transparent",
                }}
                data-ocid={`leaderboard.item.${idx + 1}`}
              >
                <span
                  className="text-sm font-bold w-5 text-center flex-shrink-0"
                  style={{
                    color:
                      idx === 0
                        ? "oklch(0.80 0.16 75)"
                        : idx === 1
                          ? "oklch(0.78 0.02 230)"
                          : idx === 2
                            ? "oklch(0.75 0.18 55)"
                            : "oklch(0.48 0.02 230)",
                  }}
                >
                  {idx === 0
                    ? "🥇"
                    : idx === 1
                      ? "🥈"
                      : idx === 2
                        ? "🥉"
                        : `${idx + 1}`}
                </span>
                <p className="flex-1 text-sm text-white truncate font-medium">
                  {entry.displayName || "Anonymous"}
                </p>
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.72 0.18 193)" }}
                >
                  {Number(entry.totalScore).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
