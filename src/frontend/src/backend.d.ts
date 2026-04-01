import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    sender: string;
    timestamp: bigint;
}
export interface Lesson {
    id: bigint;
    title: string;
    content: string;
}
export interface Vocabulary {
    meaning: string;
    word: string;
    example: string;
}
export interface Progress {
    quizScores: Array<bigint>;
    lessonsCompleted: Array<bigint>;
    vocabularyLearned: Array<string>;
}
export interface backendInterface {
    addLesson(id: bigint, title: string, content: string): Promise<void>;
    addVocabulary(id: bigint, word: string, meaning: string, example: string): Promise<void>;
    getAllLessons(): Promise<Array<Lesson>>;
    getAllVocabulary(): Promise<Array<Vocabulary>>;
    getConversation(sessionId: string): Promise<Array<Message>>;
    getProgress(sessionId: string): Promise<Progress>;
    sendMessage(sessionId: string, message: string): Promise<{
        conversation: Array<Message>;
        response: string;
    }>;
    updateProgress(sessionId: string, vocab: Array<string>, lessons: Array<bigint>, scores: Array<bigint>): Promise<void>;
}
