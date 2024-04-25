import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { React, useEffect, useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import ChatBubble from "./ChatBubble";

// key gemini: AIzaSyC-GnWQ5RfzPVj1fn734VafbNUPXthDKQs
const ChatBox = ({ visible, onRequestClose }) => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = "AIzaSyC-GnWQ5RfzPVj1fn734VafbNUPXthDKQs";

  const handleUserInput = async () => {
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );
      console.log("Gemini PRO API Response: ", response.data);
      const modelResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: "model",
            parts: [{ text: modelResponse }],
          },
        ];
        setChat(updatedChatWithModel);
        setUserInput("");
      }
    } catch (error) {
      console.error("Error fetch API: ", error);
      console.log("Error response: ", error.response);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = async (text) => {
    if (isSpeaking) {
      // Nếu đang nói, thì dừng nói
      stop(), setIsSpeaking(false);
    } else {
      // Nếu không nói, thì bắt đầu nói
      if (!(await isSpeakingAsync())) {
        speak(text);
        setIsSpeaking(true);
      }
    }
  };

  const renderChatItem = ({ item }) => (
    <ChatBubble
      role={item.role}
      text={item.parts[0].text}
      onSpeech={() => handleSpeech(item.parts[0].text)}
    />
  );
  // useEffect(() => {
  //   const StartChat = async () => {
  //     try {
  //       const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
  //       const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  //       const prompt = "Hello";

  //       const result = await model.generateContent(prompt);
  //       const response = result.response;
  //       const text = response.text();
  //       console.log('Text: ',text);
  //       setMessages([
  //         {
  //           text,
  //           user: false,
  //         },
  //       ]);
  //     } catch(error) {
  //       console.log("Error fecth API: ",error)
  //     }
  //   };
  //   StartChat();
  //   console.log('hello myfen')
  // }, []);

  // const SendMessage = async() => {
  //   setLoading(true)
  //   const userMessage = {text: userInput, user: true}
  //   setMessages([...messages, userMessage])

  //   const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
  //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  //   const prompt = userMessage.text;
  //   const result = await model.generateContent(prompt);
  //   const response = result.response;
  //   const text = response.text();
  //   setMessages([...messages, {text, user:false}])
  //   setUserInput('')
  //   setLoading(false)
  // }

  // const renderMessage = ({ item }) => (
  //   <View key={item.text}>
  //     <Text>
  //       {item.text}
  //     </Text>
  //   </View>
  // );

  return (
    // <View style={styles.container}>
    <Modal
      transparent
      hardwareAccelerated
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
    >
      <View style={styles.container}>
        <View style={styles.modal_container}>
          <View style={styles.modal_header}>
            <View style={styles.chatbot_container}>
              <Image
                style={styles.avt_chatbot}
                source={require("../chaticon/chaticon.png")}
              />
              <Text style={styles.name_chatbot}>Chat Bot</Text>
            </View>
            <Pressable
              onPress={onRequestClose}
              hitSlop={10}
              style={styles.close_btn}
            >
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>

          <View style={styles.body_chatbot}>
            <FlatList
              data={chat}
              renderItem={renderChatItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.chatContainer}
            />
          </View>

          <KeyboardAvoidingView style={styles.input_container}>
            <TextInput
              style={styles.input}
              defaultValue={userInput}
              onChangeText={(value) => setUserInput(value)}
              placeholder="Enter your answer..."
            />
            <Pressable onPress={handleUserInput} style={styles.send_btn}>
              {loading ? (
                <ActivityIndicator color={"#FFF"} />
              ) : (
                <Ionicons name="send" size={24} color="#FFF" />
              )}
            </Pressable>
          </KeyboardAvoidingView>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#00000099",
    position: 'relative'
  },
  modal_container: {
    bottom: 0,
    height: "85%",
    width: "100%",
    borderRadius: 10,
    position: 'absolute',
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  modal_header: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  chatbot_container: {
    paddingLeft: 10,
    height: 50,
    flexDirection: "row",
  },
  avt_chatbot: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  name_chatbot: {
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  close_btn: {
    position: "absolute",
    top: 5,
    right: 0,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  body_chatbot: {
    paddingHorizontal: 10,
    height: "80%",
  },
  ////////////////
  input_container: {
    bottom:5, 
    width: "95%",
    alignSelf: "center",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    height: 50,
    width: "84%",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#F2F2F2",
    borderWidth: 0.5,
    borderRadius: 10,
  },
  send_btn: {
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 10,
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#078ee6",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  chatContainer: {
    // flexGrow: 1,
    // justifyContent: "flex-end",
    marginTop: 5
  },
});
