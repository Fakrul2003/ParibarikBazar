import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { MessageSquare, Send, User, Search, CheckCircle2 } from 'lucide-react';

interface Chat {
    id: number;
    customer: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
}

export default function Messages() {
    const chats: Chat[] = [
        { id: 1, customer: 'William Davis', avatar: 'W', lastMessage: 'Is my order shipped yet?', time: '7:08 pm', unread: true },
        { id: 2, customer: 'Emma Thompson', avatar: 'E', lastMessage: 'Can I change the delivery size?', time: '6:42 pm', unread: false },
        { id: 3, customer: 'Edward Brown', avatar: 'E', lastMessage: 'Thank you! Received the package.', time: 'Yesterday', unread: false },
    ];

    const [activeChat, setActiveChat] = useState<Chat>(chats[0]);
    const [replyText, setReplyText] = useState('');
    const [conversation, setConversation] = useState([
        { sender: 'customer', text: 'Hi, is my order #3456 shipped yet?', time: '7:08 pm' },
        { sender: 'admin', text: 'Hello William! Your order is packed and will be delivered shortly.', time: '7:10 pm' },
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setConversation([
            ...conversation,
            { sender: 'admin', text: replyText, time: 'Just now' }
        ]);
        setReplyText('');
    };

    return (
        <AdminLayout title="Messages">
            <Head title="Messages - Admin Portal" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Customer Messages</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Direct inquiries and customer support communication.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden shadow-xs h-[600px]">
                
                {/* Left Inbox List */}
                <div className="md:col-span-4 border-r border-gray-100 dark:border-neutral-800 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-neutral-800 border-none rounded-xl text-xs"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-neutral-800 overflow-y-auto flex-1">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                                    activeChat.id === chat.id ? 'bg-emerald-50/70 dark:bg-emerald-950/40' : 'hover:bg-gray-50/50'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                    {chat.avatar}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{chat.customer}</h4>
                                        <span className="text-[10px] text-gray-400">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Chat Thread */}
                <div className="md:col-span-8 flex flex-col justify-between">
                    <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                            {activeChat.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">{activeChat.customer}</h3>
                            <p className="text-[10px] text-emerald-600 font-semibold">Online · Customer Support</p>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-gray-50/40 dark:bg-neutral-950/40">
                        {conversation.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-2xl text-xs shadow-xs ${
                                        msg.sender === 'admin'
                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200/60 dark:border-neutral-700'
                                    }`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Send Box */}
                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-neutral-800 flex gap-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                            <Send className="w-3.5 h-3.5" /> Send
                        </button>
                    </form>

                </div>

            </div>
        </AdminLayout>
    );
}
