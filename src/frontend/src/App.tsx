import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Answer, Level, SubmissionResult } from "./backend";
import { DisplayNameModal } from "./components/DisplayNameModal";
import { GamePlay } from "./components/GamePlay";
import { LevelMap } from "./components/LevelMap";
import { Navbar } from "./components/Navbar";
import { ResultScreen } from "./components/ResultScreen";
import { StatsSidebar } from "./components/StatsSidebar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useLeaderboard,
  useLevel,
  usePlayerProgress,
  useResetLevel,
  useSetDisplayName,
  useSubmitAnswers,
} from "./hooks/useQueries";

type Screen = "home" | "game" | "result";

function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;
  return (
    <footer
      className="w-full py-5 text-center text-xs"
      style={{
        color: "oklch(0.48 0.02 230)",
        borderTop: "1px solid oklch(0.22 0.04 233)",
      }}
    >
      © {year}. Built with ❤️ using{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors"
        style={{ color: "oklch(0.62 0.04 225)" }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = "oklch(0.72 0.18 193)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = "oklch(0.62 0.04 225)";
        }}
      >
        caffeine.ai
      </a>
    </footer>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeLevelId, setActiveLevelId] = useState<bigint | null>(null);
  const [lastResult, setLastResult] = useState<SubmissionResult | null>(null);
  const [lastLevel, setLastLevel] = useState<Level | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameModalDismissed, setNameModalDismissed] = useState(false);

  const { identity, isInitializing } = useInternetIdentity();

  const { data: progress, isLoading: isLoadingProgress } = usePlayerProgress();
  const { data: leaderboard, isLoading: isLoadingLeaderboard } =
    useLeaderboard();
  const { data: currentLevelData, isLoading: isLoadingLevel } =
    useLevel(activeLevelId);

  const submitAnswersMutation = useSubmitAnswers();
  const resetLevelMutation = useResetLevel();
  const setDisplayNameMutation = useSetDisplayName();

  // Determine current level from progress (1-indexed, starts at 1)
  const currentLevel = progress
    ? Math.max(1, Number(progress.currentLevel))
    : 1;

  // Show name modal for new logged-in users with no display name
  useEffect(() => {
    if (
      !nameModalDismissed &&
      identity &&
      !identity.getPrincipal().isAnonymous() &&
      progress !== undefined &&
      progress !== null &&
      (!progress.displayName || progress.displayName.trim() === "")
    ) {
      setShowNameModal(true);
    } else {
      setShowNameModal(false);
    }
  }, [identity, progress, nameModalDismissed]);

  const handleStartLevel = (levelId: number) => {
    if (levelId > currentLevel) {
      toast.error("Complete previous levels first!");
      return;
    }
    setActiveLevelId(BigInt(levelId));
    setScreen("game");
  };

  const handlePlayNow = () => {
    setActiveLevelId(BigInt(currentLevel));
    setScreen("game");
  };

  const handleSubmitAnswers = async (answers: Answer[]) => {
    if (!activeLevelId) return;
    try {
      const result = await submitAnswersMutation.mutateAsync({
        levelId: activeLevelId,
        answers,
      });
      setLastResult(result);
      setLastLevel(currentLevelData ?? null);
      setScreen("result");
    } catch (err) {
      toast.error("Failed to submit answers. Please try again.");
      console.error(err);
    }
  };

  const handleContinue = () => {
    if (lastResult?.passed) {
      const nextLevel = Number(lastResult.newLevel);
      setActiveLevelId(BigInt(nextLevel));
      setScreen("game");
    } else {
      setScreen("home");
    }
  };

  const handleReplay = async () => {
    if (!activeLevelId) return;
    try {
      await resetLevelMutation.mutateAsync(activeLevelId);
      setLastResult(null);
      setScreen("game");
    } catch (err) {
      toast.error("Failed to reset level. Please try again.");
      console.error(err);
    }
  };

  const handleSaveDisplayName = async (name: string) => {
    try {
      await setDisplayNameMutation.mutateAsync(name);
      setShowNameModal(false);
      setNameModalDismissed(true);
      toast.success(`Welcome, ${name}! Let the adventure begin!`);
    } catch (err) {
      toast.error("Failed to save name. Please try again.");
      console.error(err);
    }
  };

  const handleSkipName = () => {
    setShowNameModal(false);
    setNameModalDismissed(true);
  };

  // Loading state for game screen
  if (screen === "game" && activeLevelId !== null) {
    if (isLoadingLevel || !currentLevelData) {
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.10 0.035 245), oklch(0.13 0.038 238))",
          }}
        >
          <div className="text-center" data-ocid="game.loading_state">
            <div
              className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
              style={{
                borderColor: "oklch(0.72 0.18 193)",
                borderTopColor: "transparent",
              }}
            />
            <p style={{ color: "oklch(0.62 0.04 225)" }}>Loading level...</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <GamePlay
          level={currentLevelData}
          onComplete={handleSubmitAnswers}
          onBack={() => setScreen("home")}
          isSubmitting={submitAnswersMutation.isPending}
        />
        <Toaster />
      </>
    );
  }

  // Result screen
  if (screen === "result" && lastResult && lastLevel) {
    return (
      <>
        <ResultScreen
          level={lastLevel}
          result={lastResult}
          onContinue={handleContinue}
          onReplay={handleReplay}
          isResetting={resetLevelMutation.isPending}
        />
        <Toaster />
      </>
    );
  }

  // Home screen
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onPlayNow={handlePlayNow} />

      <main className="flex-1 w-full">
        {/* Hero section */}
        <div
          className="py-10 text-center"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.16 0.042 238), transparent)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.72 0.18 193)" }}
            >
              Your Adventure Awaits
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-3"
              style={{
                fontFamily: "'BricolageGrotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome to the Map,{" "}
              <span style={{ color: "oklch(0.72 0.18 193)" }}>
                {progress?.displayName?.trim()
                  ? progress.displayName
                  : "Adventurer"}
              </span>
              !
            </h1>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "oklch(0.62 0.04 225)" }}
            >
              Complete 5 levels of knowledge challenges. Score 3/5 or better to
              advance.
            </p>
          </motion.div>
        </div>

        {/* Main content grid */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
            {/* Left: Level Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <LevelMap
                currentLevel={currentLevel}
                onStartLevel={handleStartLevel}
              />
            </motion.div>

            {/* Right: Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <StatsSidebar
                progress={progress}
                leaderboard={leaderboard}
                isLoadingProgress={isLoadingProgress || isInitializing}
                isLoadingLeaderboard={isLoadingLeaderboard}
                currentLevel={currentLevel}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />

      {/* Display Name Modal */}
      <AnimatePresence>
        {showNameModal && (
          <DisplayNameModal
            onSave={handleSaveDisplayName}
            isSaving={setDisplayNameMutation.isPending}
            onSkip={handleSkipName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
