import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { mobileApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Message } from '@petco/shared';

export const ChatScreen = ({ route }: any) => {
  const { bookingId } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  const fetchMessages = async () => {
    if (!bookingId) return;
    const res = await mobileApi.get<Message[]>(`/messages/booking/${bookingId}`);
    if (res.success && res.data) setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
  }, [bookingId]);

  const handleSend = async () => {
    if (!text.trim() || !bookingId) return;
    const msgToSend = text.trim();
    setText('');

    // Fetch booking to find receiver
    const bookRes = await mobileApi.get(`/bookings/${bookingId}`);
    if (bookRes.success && bookRes.data) {
      const booking = bookRes.data;
      const receiverId = user?.id === booking.ownerId ? booking.helperId : booking.ownerId;

      const res = await mobileApi.post('/messages', {
        bookingId,
        receiverId,
        message: msgToSend,
      });

      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.id;
          return (
            <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.otherBubble]}>
              <Text style={[styles.messageText, isMine ? styles.myText : styles.otherText]}>
                {item.message}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#0d9488',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  myText: {
    color: '#ffffff',
  },
  otherText: {
    color: '#0f172a',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: '#0d9488',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
