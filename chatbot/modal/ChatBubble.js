import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ChatBubble = ({ role, text, onSpeech }) => {
  return (
    <View
      style={[
        styles.chatItem,
        role === "user" ? styles.userChatItem : styles.modelChatItem,
      ]}
    >
      {role === "model" && (
        <TouchableOpacity onPress={onSpeech} style={styles.speakerIcon}>
            <Ionicons name="volume-high-outline" size={24} color='#fff'/>
        </TouchableOpacity>
      )}
      <Text style={ role === "user" ? styles.userText : styles.botText}>{text}</Text>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  chatItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
    position: "relative",
  },
  userChatItem: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  modelChatItem: {
    alignSelf: "flex-start",
    backgroundColor: "#000",
  },
  userText: {
    fontSize: 16,
    color: "#fff",
  },
  botText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 20,
  },
  speakerIcon: {
    position: "absolute",
    // bottom: 5,
    right: 10,
    paddingVertical: 5,
  },
});
