import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_URL } from "../../../services/api";

type ModuleItem = {
  id?: string;
  title?: string;
  description?: string;
  activities?: any[];
};

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type DoubtScreenProps = {
  module?: ModuleItem | null;
  onBackToLearning?: () => void;
  onBackToModules?: () => void;
};

export default function DoubtScreen({
  module,
  onBackToLearning,
  onBackToModules,
}: DoubtScreenProps) {
  const moduleTitle = module?.title || "your learning module";

  const initialMessage = useMemo<Message>(
    () => ({
      id: "welcome",
      role: "assistant",
      text: `Hi! I’m your LocalMind learning assistant. Ask me anything about ${moduleTitle}.`,
    }),
    [moduleTitle]
  );

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Reset conversation when switching modules
  React.useEffect(() => {
    setMessages([initialMessage]);
    setInput("");
    setConversationId(null);
  }, [module?.id, initialMessage]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: question,
    };

    const typingMessage: Message = {
      id: "typing",
      role: "assistant",
      text: "Thinking...",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      typingMessage,
    ]);
    setInput("");

    try {
      const historyPayload = messages.slice(1).map(msg => ({
        role: msg.role === "assistant" ? "tutor" : "student",
        content: msg.text
      }));

      const sourceText = module?.activities?.[0]?.description || module?.description || "";
      const response = await fetch(`${API_URL}/tutor/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          conversation_id: conversationId,
          micro_module: {
            id: module?.id || "module-id",
            title: module?.title || "Module Title",
            source_text: sourceText
          },
          conversation_history: historyPayload
        })
      });

      if (!response.ok) throw new Error("Could not formulate answer.");
      const data = await response.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: data.answer || "No answer returned.",
      };

      setMessages((previous) => [
        ...previous.filter(m => m.id !== "typing"),
        assistantMessage
      ]);

    } catch (err) {
      console.error("Doubt Q&A Error:", err);
      const errorMessage: Message = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        text: "I was unable to answer your question at this moment. Please verify the backend and Ollama are running locally."
      };
      setMessages((previous) => [
        ...previous.filter(m => m.id !== "typing"),
        errorMessage
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="chatbubbles-outline" size={24} color="#38D9B0" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Ask a Doubt</Text>
          <Text style={styles.subtitle}>
            {module ? `Questions about ${moduleTitle}` : "Ask questions while you learn"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.role === "user" && styles.userRow,
            ]}
          >
            {message.role === "assistant" && (
              <View style={styles.botAvatar}>
                <Ionicons
                  name="sparkles-outline"
                  size={17}
                  color="#38D9B0"
                />
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                message.role === "user"
                  ? styles.userBubble
                  : styles.assistantBubble,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask your doubt..."
          placeholderTextColor="#73848A"
          style={styles.input}
          multiline
          onSubmitEditing={sendMessage}
        />

        <Pressable
          onPress={sendMessage}
          disabled={!input.trim()}
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
        >
          <Ionicons name="send" size={18} color="#06110F" />
        </Pressable>
      </View>

      <View style={styles.bottomActions}>
        {onBackToLearning && (
          <Pressable onPress={onBackToLearning} style={styles.secondaryButton}>
            <Ionicons name="arrow-back-outline" size={16} color="#A7B2BA" />
            <Text style={styles.secondaryText}>Back to Learning</Text>
          </Pressable>
        )}

        {onBackToModules && (
          <Pressable onPress={onBackToModules} style={styles.secondaryButton}>
            <Ionicons name="library-outline" size={16} color="#A7B2BA" />
            <Text style={styles.secondaryText}>My Courses</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050C0B",
    padding: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#203238",
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0B2924",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: "#F2F5F4",
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    color: "#8FA19D",
    fontSize: 11,
    marginTop: 4,
  },

  messages: {
    flex: 1,
  },

  messagesContent: {
    paddingVertical: 18,
    gap: 14,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "88%",
  },

  userRow: {
    alignSelf: "flex-end",
  },

  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0B2924",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 14,
    flexShrink: 1,
  },

  assistantBubble: {
    backgroundColor: "#101D21",
    borderWidth: 1,
    borderColor: "#253A40",
    borderBottomLeftRadius: 4,
  },

  userBubble: {
    backgroundColor: "#0C6A57",
    borderBottomRightRadius: 4,
  },

  messageText: {
    color: "#EAF1EF",
    fontSize: 13,
    lineHeight: 20,
  },

  inputArea: {
    width: "100%",
    minHeight: 58,
    borderWidth: 1,
    borderColor: "#263A40",
    borderRadius: 14,
    backgroundColor: "#0B171B",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingRight: 8,
    // React Native Web can otherwise calculate the padded row wider than its parent.
    // Keeping the box inside the available width prevents the send button being clipped.
    boxSizing: "border-box",
    overflow: "visible",
  },

  input: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    color: "#F2F5F4",
    fontSize: 13,
    maxHeight: 110,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 20,
    backgroundColor: "#38D9B0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  secondaryText: {
    color: "#A7B2BA",
    fontSize: 11,
    fontWeight: "700",
  },
});
