'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { api } from '@/lib/api';
import { Booking, Message, SOCKET_EVENTS } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { MessageSquare, Send, Calendar, Clock, Dog, Check, CheckCheck } from 'lucide-react';
import { clsx } from 'clsx';

function ChatContent() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get('bookingId');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's bookings with chat enabled
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await api.get<Booking[]>('/bookings');
      if (res.success && res.data) {
        setBookings(res.data);
        if (initialBookingId) {
          const found = res.data.find((b) => b.id === initialBookingId);
          if (found) setSelectedBooking(found);
        } else if (res.data.length > 0) {
          setSelectedBooking(res.data[0]);
        }
      }
    };
    fetchBookings();
  }, [initialBookingId]);

  // Load messages and join Socket.IO room for selected booking
  useEffect(() => {
    if (!selectedBooking) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      const res = await api.get<Message[]>(`/messages/booking/${selectedBooking.id}`);
      if (res.success && res.data) {
        setMessages(res.data);
      }
      setIsLoadingMessages(false);
    };

    fetchMessages();

    if (socket) {
      const room = `booking:${selectedBooking.id}`;
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, room);

      const handleIncomingMessage = (msg: Message) => {
        if (msg.bookingId === selectedBooking.id) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleIncomingMessage);

      return () => {
        socket.emit(SOCKET_EVENTS.LEAVE_ROOM, room);
        socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleIncomingMessage);
      };
    }
  }, [selectedBooking?.id, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedBooking || !user) return;

    const textToSend = inputText.trim();
    setInputText('');

    const otherParticipantId =
      user.id === selectedBooking.ownerId ? selectedBooking.helperId : selectedBooking.ownerId;

    const res = await api.post<Message>('/messages', {
      bookingId: selectedBooking.id,
      receiverId: otherParticipantId,
      message: textToSend,
    });

    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data!]);
      if (socket) {
        socket.emit(SOCKET_EVENTS.NEW_MESSAGE, {
          bookingId: selectedBooking.id,
          message: res.data,
        });
      }
    }
  };

  const otherUser = selectedBooking
    ? user?.id === selectedBooking.ownerId
      ? selectedBooking.helper
      : selectedBooking.owner
    : null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-4">
      {/* Conversations List */}
      <div className="w-full md:w-80 bg-white rounded-3xl border border-slate-200/80 p-4 flex flex-col shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 mb-3 px-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-teal-600" /> Care Conversations
        </h2>

        <div className="flex-1 overflow-y-auto space-y-2">
          {bookings.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">No active booking conversations</p>
          ) : (
            bookings.map((b) => {
              const partner = user?.id === b.ownerId ? b.helper : b.owner;
              const isSelected = selectedBooking?.id === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={clsx(
                    'p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3',
                    isSelected
                      ? 'bg-teal-50 border border-teal-200 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  )}
                >
                  <Avatar src={partner?.profileImage} name={partner?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{partner?.name}</h4>
                    <p className="text-[11px] text-teal-700 truncate">
                      {b.request?.pet?.name} • {b.request?.serviceType?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Active Chat Window */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 flex flex-col shadow-sm overflow-hidden">
        {selectedBooking && otherUser ? (
          <>
            {/* Chat Top Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Avatar src={otherUser.profileImage} name={otherUser.name} size="md" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{otherUser.name}</h3>
                  <p className="text-[11px] text-teal-700 font-semibold">
                    {selectedBooking.request?.serviceType?.replace('_', ' ')} for {selectedBooking.request?.pet?.name}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{new Date(selectedBooking.request?.scheduledDate || '').toLocaleDateString()}</span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {isLoadingMessages ? (
                <div className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <Dog className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-500">
                    Send a message to coordinate timing, pet notes, or access instructions!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === user?.id;

                  return (
                    <div
                      key={msg.id}
                      className={clsx('flex flex-col', isMine ? 'items-end' : 'items-start')}
                    >
                      <div
                        className={clsx(
                          'max-w-[75%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm',
                          isMine
                            ? 'bg-teal-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        )}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3">
              <input
                type="text"
                placeholder={`Message ${otherUser.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <Button type="submit" size="md" disabled={!inputText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Select a conversation to begin</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div className="text-center py-12"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
      <ChatContent />
    </React.Suspense>
  );
}
