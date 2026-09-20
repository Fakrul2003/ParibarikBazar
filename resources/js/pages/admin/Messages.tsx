import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { MessageSquare, Send, Image as ImageIcon, Search, X } from 'lucide-react';

interface CustomerThread {
    id: number;
    name: string;
    email: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
}

interface MessageItem {
    id: number;
    user_id: number;
    sender_id: number;
    message?: string;
    image?: string;
    created_at: string;
    sender?: {
        id: number;
        name: string;
        role?: string;
    };
}

interface Props {
    customers: CustomerThread[];
    activeUserId?: number | null;
    messages: MessageItem[];
}

export default function Messages({ customers = [], activeUserId, messages = [] }: Props) {
    const { props } = usePage();
    const currentUserId = props.auth?.user?.id as number | undefined;
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCustomer = customers.find(c => c.id === activeUserId) || filteredCustomers[0] || null;

    const handleSelectCustomer = (customerId: number) => {
        router.get('/admin/messages', { user_id: customerId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getImageUrl = (img?: string) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeCustomer) return;
        if (!replyText.trim() && !selectedImage) return;

        setIsSending(true);
        const formData = new FormData();
        formData.append('user_id', String(activeCustomer.id));
        if (replyText.trim()) formData.append('message', replyText.trim());
        if (selectedImage) formData.append('image', selectedImage);

        router.post('/messages/send', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyText('');
                setSelectedImage(null);
                setImagePreview(null);
                setIsSending(false);
            },
            onError: () => {
                setIsSending(false);
            }
        });
    };

    return (
        <AdminLayout title="Messages">
            <Head title="Messages - Admin Portal" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Customer Messages</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Direct inquiries and customer support communication with image attachment support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden shadow-xs h-[calc(100vh-150px)] min-h-0">

                {/* Left Inbox List */}
                <div className="md:col-span-4 border-r border-gray-100 dark:border-neutral-800 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search customer..."
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-neutral-800 overflow-y-auto flex-1">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((chat) => {
                                const isSelected = activeCustomer?.id === chat.id;
                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => handleSelectCustomer(chat.id)}
                                        className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                                            isSelected ? 'bg-emerald-50/80 dark:bg-emerald-950/50' : 'hover:bg-gray-50/50 dark:hover:bg-neutral-800/40'
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                                            {chat.avatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{chat.name}</h4>
                                                <span className="text-[10px] text-gray-400">{chat.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'No messages'}</p>
                                        </div>
                                        {chat.unread && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-xs text-gray-400">
                                No message threads found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Chat Thread */}
                {activeCustomer ? (
                    <div className="md:col-span-8 flex flex-col h-full min-h-0 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-3 bg-gray-50/40 dark:bg-neutral-900">
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                {activeCustomer.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{activeCustomer.name}</h3>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{activeCustomer.email}</p>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-gray-50/40 dark:bg-neutral-950/40">
                            {messages && messages.length > 0 ? (
                                messages.map((msg) => {
                                    const isAdminMessage = currentUserId ? msg.sender_id === currentUserId : msg.sender?.role === 'admin';
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isAdminMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs shadow-xs space-y-2 ${
                                                    isAdminMessage
                                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                                        : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200/60 dark:border-neutral-700'
                                                }`}
                                            >
                                                {!isAdminMessage && (
                                                    <p className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400 mb-1">
                                                        {activeCustomer.name}
                                                    </p>
                                                )}
                                                {msg.image && (
                                                    <a href={getImageUrl(msg.image)!} target="_blank" rel="noreferrer" className="block">
                                                        <img
                                                            src={getImageUrl(msg.image)!}
                                                            alt="Attached"
                                                            className="w-full max-h-48 object-cover rounded-xl border border-black/10 dark:border-white/10"
                                                        />
                                                    </a>
                                                )}
                                                {msg.message && <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>}
                                                <span className={`text-[9px] block text-right mt-1 ${isAdminMessage ? 'text-emerald-100' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                    No messages in this conversation yet.
                                </div>
                            )}
                        </div>

                        {/* Send Box */}
                        <form
                                onSubmit={handleSend}
                                className="sticky bottom-0 z-20 p-4 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                            >
                            {imagePreview && (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-gray-300 dark:border-neutral-700" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <label className="p-2.5 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800">
                                    <ImageIcon className="w-5 h-5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${activeCustomer.name}...`}
                                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || (!replyText.trim() && !selectedImage)}
                                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" /> {isSending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </form>

                    </div>
                ) : (
                    <div className="md:col-span-8 flex items-center justify-center text-gray-400 text-sm">
                        Select a customer from the left list to start messaging.
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
