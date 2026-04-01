# Prabesh

## Current State
New project. Empty backend and no frontend yet.

## Requested Changes (Diff)

### Add
- AI Voice Chat section: microphone-based speech input (Web Speech API), text-to-speech output, text input fallback, chat bubble UI
- Japanese Language Learning section with:
  - Hiragana and Katakana charts with pronunciation guides
  - Vocabulary and phrases by category (greetings, numbers, food, travel, etc.)
  - Grammar lessons from basic to advanced
  - Kanji learning with stroke order descriptions and meanings
  - Flashcard-style quizzes for vocabulary and characters
  - JLPT level guide (N5 to N1)
- Navigation between Voice Chat and Japanese Learning sections
- No authentication anywhere

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: minimal Motoko actor with a simple AI response function (rule-based for Japanese practice) and JLPT content endpoints
2. Frontend: two-section SPA with nav, Voice Chat UI, and full Japanese Learning UI
3. Voice Chat: Web Speech API for STT, SpeechSynthesis API for TTS, text input fallback, AI responses via backend
4. Japanese Learning: tabbed interface for Hiragana/Katakana charts, vocabulary, grammar, kanji, quizzes, JLPT guide
5. Flashcard quiz: flip-card interaction, score tracking
