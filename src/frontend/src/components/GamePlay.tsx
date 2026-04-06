import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Answer, Level } from "../backend";

const LEVEL_EMOJIS: Record<number, string> = {
  1: "🌲",
  2: "🌊",
  3: "🚀",
  4: "🏛️",
  5: "⚗️",
};

interface GamePlayProps {
  level: Level;
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function GamePlay({
  level,
  onComplete,
  onBack,
  isSubmitting,
}: GamePlayProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);

  const levelId = Number(level.id);
  const questions = level.questions;
  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;

  const handleSelectChoice = (idx: number) => {
    if (answered) return;
    setSelectedChoice(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedChoice === null) return;
    const isCorrect = BigInt(selectedChoice) === currentQuestion.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswered(true);
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      choice: BigInt(selectedChoice),
    };
    const allAnswers = [...answers, newAnswer];
    setAnswers(allAnswers);

    if (isLastQuestion) {
      setTimeout(() => onComplete(allAnswers), 1200);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIdx((i) => i + 1);
    setSelectedChoice(null);
    setAnswered(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.10 0.035 245), oklch(0.13 0.038 238))",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: "oklch(0.62 0.04 225)",
              background: "oklch(0.19 0.04 235)",
            }}
            data-ocid="game.link"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{LEVEL_EMOJIS[levelId] || "🎮"}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{level.name}</h1>
              <p className="text-sm" style={{ color: "oklch(0.72 0.18 193)" }}>
                {level.theme}
              </p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs" style={{ color: "oklch(0.62 0.04 225)" }}>
              Score
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "oklch(0.80 0.16 75)" }}
            >
              {score}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "oklch(0.62 0.04 225)" }}>
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <span style={{ color: "oklch(0.72 0.18 193)" }}>
              {Math.round((currentQuestionIdx / questions.length) * 100)}%
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
              animate={{
                width: `${(currentQuestionIdx / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {/* Question dots */}
          <div className="flex gap-1.5 mt-2 justify-center">
            {questions.map((q, idx) => (
              <div
                key={q.id.toString()}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: idx === currentQuestionIdx ? 20 : 8,
                  background:
                    idx < currentQuestionIdx
                      ? "oklch(0.73 0.18 152)"
                      : idx === currentQuestionIdx
                        ? "oklch(0.72 0.18 193)"
                        : "oklch(0.28 0.04 230)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="rounded-2xl p-6 mb-5 shadow-card"
              style={{
                background: "oklch(0.19 0.042 235)",
                border: "1px solid oklch(0.28 0.04 230)",
              }}
              data-ocid="game.card"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.72 0.18 193)" }}
              >
                Q{currentQuestionIdx + 1}
              </p>
              <p className="text-lg font-semibold text-white leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedChoice === idx;
                const isCorrect =
                  answered && BigInt(idx) === currentQuestion.correctAnswer;
                const isWrong =
                  answered &&
                  isSelected &&
                  BigInt(idx) !== currentQuestion.correctAnswer;

                return (
                  <motion.button
                    key={option}
                    type="button"
                    onClick={() => handleSelectChoice(idx)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    className="w-full text-left px-5 py-4 rounded-xl font-medium text-sm transition-all flex items-center gap-3"
                    style={{
                      background: isCorrect
                        ? "oklch(0.22 0.07 152)"
                        : isWrong
                          ? "oklch(0.22 0.07 27)"
                          : isSelected
                            ? "oklch(0.22 0.07 210)"
                            : "oklch(0.22 0.04 233)",
                      border: isCorrect
                        ? "1.5px solid oklch(0.73 0.18 152)"
                        : isWrong
                          ? "1.5px solid oklch(0.63 0.22 27)"
                          : isSelected
                            ? "1.5px solid oklch(0.72 0.18 193)"
                            : "1.5px solid oklch(0.28 0.04 230)",
                      color: "oklch(0.92 0.012 230)",
                      boxShadow: isCorrect
                        ? "0 0 12px oklch(0.73 0.18 152 / 0.3)"
                        : isSelected && !answered
                          ? "0 0 12px oklch(0.72 0.18 193 / 0.3)"
                          : "none",
                    }}
                    data-ocid="game.button"
                  >
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: isCorrect
                          ? "oklch(0.73 0.18 152)"
                          : isWrong
                            ? "oklch(0.63 0.22 27)"
                            : isSelected
                              ? "oklch(0.72 0.18 193)"
                              : "oklch(0.28 0.04 230)",
                        color:
                          isCorrect || isWrong || isSelected
                            ? "oklch(0.1 0.02 240)"
                            : "oklch(0.62 0.04 225)",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && (
                      <CheckCircle2
                        size={18}
                        style={{ color: "oklch(0.73 0.18 152)" }}
                      />
                    )}
                    {isWrong && (
                      <XCircle
                        size={18}
                        style={{ color: "oklch(0.63 0.22 27)" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Action Button */}
            {!answered ? (
              <Button
                onClick={handleConfirmAnswer}
                disabled={selectedChoice === null}
                className="w-full h-12 text-base font-semibold transition-all"
                style={{
                  background:
                    selectedChoice !== null
                      ? "oklch(0.72 0.18 193)"
                      : "oklch(0.22 0.04 233)",
                  color:
                    selectedChoice !== null
                      ? "oklch(0.1 0.03 240)"
                      : "oklch(0.48 0.02 230)",
                  border: "none",
                }}
                data-ocid="game.submit_button"
              >
                Confirm Answer
              </Button>
            ) : !isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="w-full h-12 text-base font-semibold"
                style={{
                  background: "oklch(0.72 0.18 193)",
                  color: "oklch(0.1 0.03 240)",
                  border: "none",
                }}
                data-ocid="game.primary_button"
              >
                Next Question →
              </Button>
            ) : (
              <div
                className="w-full h-12 rounded-lg flex items-center justify-center text-sm font-medium"
                style={{
                  background: "oklch(0.22 0.07 152)",
                  color: "oklch(0.73 0.18 152)",
                }}
                data-ocid="game.loading_state"
              >
                {isSubmitting ? "Submitting..." : "Calculating results..."}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
