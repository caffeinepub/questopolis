import { CheckCircle2, ChevronRight, Lock, Star } from "lucide-react";
import { motion } from "motion/react";

const LEVELS = [
  {
    id: 1,
    name: "The Forest Path",
    theme: "Nature",
    difficulty: "Easy",
    emoji: "🌲",
    diffColor: "oklch(0.73 0.18 152)",
  },
  {
    id: 2,
    name: "Ocean Depths",
    theme: "Oceans",
    difficulty: "Easy-Med",
    emoji: "🌊",
    diffColor: "oklch(0.72 0.16 207)",
  },
  {
    id: 3,
    name: "Cosmic Journey",
    theme: "Space",
    difficulty: "Medium",
    emoji: "🚀",
    diffColor: "oklch(0.75 0.18 55)",
  },
  {
    id: 4,
    name: "Ancient Civilizations",
    theme: "History",
    difficulty: "Med-Hard",
    emoji: "🏛️",
    diffColor: "oklch(0.72 0.18 50)",
  },
  {
    id: 5,
    name: "Science Lab",
    theme: "Science",
    difficulty: "Hard",
    emoji: "⚗️",
    diffColor: "oklch(0.63 0.22 27)",
  },
];

interface LevelMapProps {
  currentLevel: number;
  onStartLevel: (levelId: number) => void;
}

export function LevelMap({ currentLevel, onStartLevel }: LevelMapProps) {
  const completedCount = currentLevel - 1;
  const progressPct = (completedCount / LEVELS.length) * 100;

  return (
    <div className="card-game p-6 h-full shadow-card">
      {/* Map header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          Level Progression Map
        </h2>
        <span
          className="text-sm font-medium"
          style={{ color: "oklch(0.72 0.18 193)" }}
        >
          Chapter 1 — The Quest Begins
        </span>
      </div>

      {/* Map image backdrop */}
      <div
        className="relative rounded-xl overflow-hidden mb-5"
        style={{ minHeight: 180 }}
      >
        <img
          src="/assets/generated/level-map-bg.dim_1200x500.jpg"
          alt="Level Map"
          className="w-full h-44 object-cover opacity-60"
          loading="lazy"
          decoding="async"
        />
        {/* Overlay path dots */}
        <div className="absolute inset-0 flex items-center justify-around px-6">
          {LEVELS.map((level, idx) => {
            const isCompleted = level.id < currentLevel;
            const isCurrent = level.id === currentLevel;
            const isLocked = level.id > currentLevel;

            return (
              <motion.div
                key={level.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: idx * 0.08,
                  type: "spring",
                  stiffness: 200,
                }}
                className="flex flex-col items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => !isLocked && onStartLevel(level.id)}
                  disabled={isLocked}
                  className={[
                    "w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all",
                    isCompleted
                      ? "glow-success"
                      : isCurrent
                        ? "glow-cyan animate-pulse-glow"
                        : "",
                    isLocked
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:scale-110",
                  ].join(" ")}
                  style={{
                    background: isCompleted
                      ? "oklch(0.25 0.08 152)"
                      : isCurrent
                        ? "linear-gradient(135deg, oklch(0.22 0.06 210), oklch(0.28 0.08 190))"
                        : "oklch(0.22 0.02 230)",
                    border: isCompleted
                      ? "2px solid oklch(0.73 0.18 152)"
                      : isCurrent
                        ? "2px solid oklch(0.72 0.18 193)"
                        : "2px solid oklch(0.35 0.02 230)",
                    boxShadow: isCurrent
                      ? "0 0 20px oklch(0.72 0.18 193 / 0.6)"
                      : isCompleted
                        ? "0 0 12px oklch(0.73 0.18 152 / 0.5)"
                        : "none",
                  }}
                  data-ocid="level.button"
                  aria-label={`Level ${level.id}: ${level.name}`}
                >
                  {isCompleted ? (
                    <CheckCircle2
                      size={24}
                      style={{ color: "oklch(0.73 0.18 152)" }}
                    />
                  ) : isLocked ? (
                    <Lock size={18} style={{ color: "oklch(0.48 0.02 230)" }} />
                  ) : (
                    <span className="text-lg">{level.emoji}</span>
                  )}
                </button>
                <span
                  className="text-xs font-medium text-center"
                  style={{
                    color: isLocked
                      ? "oklch(0.48 0.02 230)"
                      : "oklch(0.85 0.015 230)",
                    maxWidth: 56,
                  }}
                >
                  L{level.id}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div
          className="flex justify-between text-xs mb-2"
          style={{ color: "oklch(0.62 0.04 225)" }}
        >
          <span>Progress</span>
          <span>
            {completedCount}/{LEVELS.length} Levels Complete
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "oklch(0.22 0.04 233)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.18 193), oklch(0.73 0.18 152))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Level cards list */}
      <div className="space-y-2">
        {LEVELS.map((level, idx) => {
          const isCompleted = level.id < currentLevel;
          const isCurrent = level.id === currentLevel;
          const isLocked = level.id > currentLevel;

          return (
            <motion.div
              key={level.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + idx * 0.06 }}
              className={[
                "card-panel flex items-center gap-4 p-3 transition-all",
                isCurrent || isCompleted ? "cursor-pointer" : "opacity-60",
              ].join(" ")}
              style={{
                borderColor: isCurrent
                  ? "oklch(0.72 0.18 193 / 0.7)"
                  : isCompleted
                    ? "oklch(0.73 0.18 152 / 0.4)"
                    : undefined,
                boxShadow: isCurrent
                  ? "0 0 12px oklch(0.72 0.18 193 / 0.2)"
                  : "none",
              }}
              onClick={() => !isLocked && onStartLevel(level.id)}
              data-ocid={`level.item.${idx + 1}`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  background: isCompleted
                    ? "oklch(0.22 0.06 152)"
                    : isCurrent
                      ? "oklch(0.22 0.06 210)"
                      : "oklch(0.20 0.02 230)",
                }}
              >
                {isCompleted ? (
                  <CheckCircle2
                    size={18}
                    style={{ color: "oklch(0.73 0.18 152)" }}
                  />
                ) : isLocked ? (
                  <Lock size={14} style={{ color: "oklch(0.48 0.02 230)" }} />
                ) : (
                  level.emoji
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-white truncate">
                    {level.name}
                  </p>
                  {isCurrent && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{
                        background: "oklch(0.22 0.08 193)",
                        color: "oklch(0.72 0.18 193)",
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                  {isCompleted && (
                    <Star
                      size={12}
                      style={{ color: "oklch(0.80 0.16 75)" }}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.62 0.04 225)" }}
                  >
                    {level.theme}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: `${level.diffColor}22`,
                      color: level.diffColor,
                    }}
                  >
                    {level.difficulty}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              {!isLocked && (
                <ChevronRight
                  size={16}
                  style={{
                    color: isCurrent
                      ? "oklch(0.72 0.18 193)"
                      : "oklch(0.48 0.02 230)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
