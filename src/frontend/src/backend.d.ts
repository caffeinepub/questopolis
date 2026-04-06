import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    displayName: string;
    player: Principal;
    totalScore: bigint;
}
export type Time = bigint;
export interface PlayerProgress {
    lastPlayed: Time;
    streak: bigint;
    displayName: string;
    player: Principal;
    totalScore: bigint;
    currentLevel: bigint;
}
export interface Answer {
    questionId: bigint;
    choice: bigint;
}
export interface SubmissionResult {
    streak: bigint;
    score: bigint;
    totalScore: bigint;
    newLevel: bigint;
    correctAnswers: bigint;
    passed: boolean;
}
export interface Question {
    id: bigint;
    text: string;
    correctAnswer: bigint;
    options: Array<string>;
}
export interface Level {
    id: bigint;
    theme: string;
    name: string;
    questions: Array<Question>;
}
export interface backendInterface {
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLevel(levelId: bigint): Promise<Level>;
    getPlayerProgress(player: Principal): Promise<PlayerProgress>;
    resetLevel(levelId: bigint): Promise<void>;
    setDisplayName(name: string): Promise<void>;
    submitAnswers(levelId: bigint, answers: Array<Answer>): Promise<SubmissionResult>;
}
