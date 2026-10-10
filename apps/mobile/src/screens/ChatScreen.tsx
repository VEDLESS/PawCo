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
  ActivityIndicator,
} from 'react-native';
import { mobileApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Message } from '@petco/shared';

export const ChatScreen = ({ route }: any) => {
  const { bookingId } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!bookingId) return;
    const res = await mobileApi.get<Message[]>(`/messages/booking/${bookingId}`);
    if (res.success && res.data) setMessages(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [bookingId]);

  const handleSend = async () => {
    if (!text.trim() || !bookingId || isSending) return;
    const msgToSend = text.trim();
    setText('');
    setIsSending(true);

    try {
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
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color="#0f766e" size="small" />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>Direct Care Channel</Text>
          <Text style={styles.emptyText}>
            Coordinate arrival times, share photo updates, and communicate instructions securely.
          </Text>
        </View>
      ) : (
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
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!text.trim() || isSending) && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || isSending}
          activeOpacity={0.8}
        >
          {isSending ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#0f766e',
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
    fontSize: 14,
    lineHeight: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    backgroundColor: '#0f766e',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
