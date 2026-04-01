import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  // Types

  type Message = {
    sender : Text;
    content : Text;
    timestamp : Int;
  };

  type Progress = {
    vocabularyLearned : [Text];
    lessonsCompleted : [Nat];
    quizScores : [Nat];
  };

  type Lesson = {
    id : Nat;
    title : Text;
    content : Text;
  };

  type Vocabulary = {
    word : Text;
    meaning : Text;
    example : Text;
  };

  module Lesson {
    public func compare(lesson1 : Lesson, lesson2 : Lesson) : Order.Order {
      Nat.compare(lesson1.id, lesson2.id);
    };
  };

  let conversations = Map.empty<Text, [Message]>();
  let progresses = Map.empty<Text, Progress>();
  let lessons = Map.fromIter<Nat, Lesson>([].values());
  let vocabularies = Map.fromIter<Nat, Vocabulary>([].values());

  // Chat

  public shared ({ caller }) func sendMessage(sessionId : Text, message : Text) : async {
    response : Text;
    conversation : [Message];
  } {
    let response = aiRespond(message);
    let timestamp = 0; // Replace with actual timestamp if needed

    let newMessages = [
      { sender = "user"; content = message; timestamp },
      { sender = "ai"; content = response; timestamp },
    ];

    let previousConversation = switch (conversations.get(sessionId)) {
      case (null) { [] };
      case (?c) { c };
    };

    let mergedConversation = newMessages.concat(previousConversation);

    let cappedConversation = mergedConversation.sliceToArray(
      0,
      Nat.min(20, mergedConversation.size()),
    );

    conversations.add(sessionId, cappedConversation);

    {
      response;
      conversation = cappedConversation;
    };
  };

  public query ({ caller }) func getConversation(sessionId : Text) : async [Message] {
    switch (conversations.get(sessionId)) {
      case (null) { [] };
      case (?c) { c };
    };
  };

  // Learning Progress

  public shared ({ caller }) func updateProgress(sessionId : Text, vocab : [Text], lessons : [Nat], scores : [Nat]) : async () {
    let progress : Progress = {
      vocabularyLearned = vocab;
      lessonsCompleted = lessons;
      quizScores = scores;
    };
    progresses.add(sessionId, progress);
  };

  public query ({ caller }) func getProgress(sessionId : Text) : async Progress {
    switch (progresses.get(sessionId)) {
      case (null) { Runtime.trap("Progress not found") };
      case (?p) { p };
    };
  };

  // Content Management

  public shared ({ caller }) func addLesson(id : Nat, title : Text, content : Text) : async () {
    let lesson : Lesson = { id; title; content };
    lessons.add(id, lesson);
  };

  public shared ({ caller }) func addVocabulary(id : Nat, word : Text, meaning : Text, example : Text) : async () {
    let vocab : Vocabulary = { word; meaning; example };
    vocabularies.add(id, vocab);
  };

  public query ({ caller }) func getAllLessons() : async [Lesson] {
    lessons.values().toArray().sort();
  };

  public query ({ caller }) func getAllVocabulary() : async [Vocabulary] {
    vocabularies.values().toArray();
  };

  // AI Response Function

  func aiRespond(message : Text) : Text {
    if (message.contains(#text "hello")) {
      "こんにちは！ How can I help you with your Japanese today?";
    } else if (message.contains(#text "thank you")) {
      "どういたしまして！ Happy to help.";
    } else if (message.contains(#text "quiz")) {
      "Let's start a quiz! Ready?";
    } else if (message.contains(#text "how do you say")) {
      "That's a great question! Can you specify the word?";
    } else {
      "I'm here to help you learn Japanese. Ask me anything about vocabulary, grammar, or conversation!";
    };
  };

  // Add some default lessons and vocabulary

  system func preupgrade() { };
  system func postupgrade() {
    let defaultLessons = [
      (1, {
        id = 1;
        title = "Introduction";
        content = "Welcome to Japanese learning!";
      }),
      (
        2,
        {
          id = 2;
          title = "Basic Greetings";
          content = "Learn how to greet in Japanese.";
        },
      ),
    ];

    let defaultVocabulary = [
      (1, { word = "こんにちは"; meaning = "Hello"; example = "こんにちは、元気ですか？" }),
      (2, { word = "ありがとう"; meaning = "Thank you"; example = "手伝ってくれてありがとう。" }),
    ];

    for ((id, lesson) in defaultLessons.values()) {
      lessons.add(id, lesson);
    };
    for ((id, vocab) in defaultVocabulary.values()) {
      vocabularies.add(id, vocab);
    };
  };
};
