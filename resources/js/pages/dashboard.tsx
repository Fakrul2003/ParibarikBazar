import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import OrdersPage from './admin/Orders';
import { Send, Image as ImageIcon, X, MessageSquare } from 'lucide-react';

interface User {
    id?: number;
    name: string;
    email: string;
    role?: string;
}

interface Order {
    id: number;
    user_id?: number;
    product_id?: number;
    name: string;
    address: string;
    phone: string;
    size?: string;
    size_data?: string;
    sizes_data?: string;
    quantity: number;
    total_price: number;
    status: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email?: string;
    };
    product?: {
        id: number;
        name: string;
        price: number;
        category?: string;
        image?: string;
        image_2?: string;
        image_3?: string;
        sizes?: string;
    };
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

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
    orders: Order[];
    messages?: MessageItem[];
}

export default function Dashboard() {
    const { auth, orders, messages = [] } = usePage<PageProps>().props;
   //     const isAdmin = true;
    const isAdmin = auth?.user && auth.user.role === 'admin';

    const [messageText, setMessageText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    if (isAdmin) {
        return <OrdersPage orders={orders} auth={auth} />;
    }

    const updateStatus = (orderId: number) => {
        router.patch(`/orders/${orderId}/status`);
    };

    const getImageUrl = (img?: string) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    const getProductImage = (order: Order) => {
        const rawData = order.sizes_data || order.size_data || order.size;
        if (rawData) {
            try {
                const parsed = JSON.parse(rawData);
                const variantList = Array.isArray(parsed?.variants)
                    ? parsed.variants
                    : Array.isArray(parsed)
                    ? parsed
                    : null;
                if (variantList && variantList.length > 0) {
                    const firstWithImg = variantList.find((v: any) => v.colorImg || v.color_img || v.image);
                    if (firstWithImg) {
                        const img = firstWithImg.colorImg || firstWithImg.color_img || firstWithImg.image;
                        const url = getImageUrl(img);
                        if (url) return url;
                    }
                }
            } catch {}
        }
        if (order.product?.image) return getImageUrl(order.product.image);
        if (order.product?.image_2) return getImageUrl(order.product.image_2);
        if (order.product?.image_3) return getImageUrl(order.product.image_3);
        return null;
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

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() && !selectedImage) return;

        setIsSending(true);
        const formData = new FormData();
        if (messageText.trim()) formData.append('message', messageText.trim());
        if (selectedImage) formData.append('image', selectedImage);

        router.post('/messages/send', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setMessageText('');
                setSelectedImage(null);
                setImagePreview(null);
                setIsSending(false);
            },
            onError: () => {
                setIsSending(false);
            }
        });
    };

    const renderSizeInfo = (order: Order) => {
        const rawData = order.sizes_data || order.size_data || order.size;
        if (!rawData) {
            return <span className="text-gray-400">প্রযোজ্য নয়</span>;
        }

        try {
            const parsed = JSON.parse(rawData);
            if (parsed && typeof parsed === 'object') {
                const variantList = Array.isArray(parsed.variants)
                    ? parsed.variants
                    : Array.isArray(parsed)
                    ? parsed
                    : null;

                if (variantList && variantList.length > 0) {
                    return (
                        <div className="text-xs space-y-1">
                            {variantList.map((v: any, idx: number) => {
                                const vImg = v.colorImg || v.color_img || v.image;
                                const vImgUrl = getImageUrl(vImg);
                                return (
                                    <div key={idx} className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 font-medium flex items-center gap-1.5 flex-wrap">
                                        {vImgUrl && (
                                            <img src={vImgUrl} alt={v.color || 'variant'} className="w-5 h-5 object-cover rounded border border-gray-300 dark:border-neutral-600 shrink-0" />
                                        )}
                                        {v.color && (
                                            <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-neutral-900 px-1.5 py-0.5 rounded text-[11px] border border-gray-200 dark:border-neutral-700">
                                                🎨 {v.color}
                                            </span>
                                        )}
                                        <span>সাইজ: <strong className="text-emerald-600 dark:text-emerald-400">{v.size || 'N/A'}</strong></span>
                                        <span className="text-gray-500">(পরিমাণ: {v.quantity || v.qty || 1})</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }

                if (Object.keys(parsed).length > 0) {
                    return (
                        <div className="text-xs space-y-1">
                            {Object.entries(parsed).map(([size, qty]) => (
                                <div key={size} className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 font-medium">
                                    সাইজ: <span className="font-bold text-green-600 dark:text-green-400">{size}</span> (পরিমাণ: {String(qty)})
                                </div>
                            ))}
                        </div>
                    );
                }
            }
        } catch {
            // Plain text size fallback
        }

        return (
            <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700 text-xs font-semibold">
                {rawData}
            </span>
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="px-4 pt-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                >
                    Home page
                </Link>
            </div>

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                <div className="flex flex-col gap-6">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">ইউজার ড্যাশবোর্ড</h2>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">স্বাগতম, {auth.user.name}! আপনার অর্ডার করা পণ্যগুলোর স্ট্যাটাস ও মেসেজ নিচে দেখতে পাবেন।</p>
                    </div>

                    {/* ইউজারের নিজের অর্ডার হিস্ট্রি টেবিল */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                            <h3 className="font-bold text-base">আমার অর্ডার হিস্ট্রি</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-neutral-800 text-xs uppercase text-gray-600 dark:text-gray-300">
                                        <th className="p-3">অর্ডার আইডি</th>
                                        <th className="p-3">প্রোডাক্ট</th>
                                        <th className="p-3">পরিমাণ</th>
                                        <th className="p-3">সাইজ</th>
                                        <th className="p-3">মোট দাম</th>
                                        <th className="p-3">স্ট্যাটাস</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders && orders.length > 0 ? (
                                        orders.map((order) => {
                                            const statusUpper = (order.status || 'PENDING').toUpperCase();
                                            return (
                                                <tr key={order.id} className="border-t border-gray-200 dark:border-neutral-800 text-sm">
                                                    <td className="p-3 font-medium">#{order.id}</td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {getProductImage(order) ? (
                                                                <img
                                                                    src={getProductImage(order)!}
                                                                    alt={order.product?.name || order.name}
                                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0 border border-gray-200 dark:border-neutral-700">
                                                                    ছবি নেই
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{order.product?.name || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">{order.quantity} টি</td>
                                                    <td className="p-3">{renderSizeInfo(order)}</td>
                                                    <td className="p-3 font-semibold">৳ {order.total_price}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${statusUpper === 'DELIVERED' || statusUpper === 'PAID'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                            : statusUpper === 'OUT FOR DELIVERY'
                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                                                                : statusUpper === 'REJECTED' || statusUpper === 'CANCELLED'
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                                            }`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center p-4 text-gray-500">আপনি এখনও কোনো অর্ডার করেননি।</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ইউজার কাস্টমার সাপোর্ট চ্যাট বক্স */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/40 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <h3 className="font-bold text-base text-gray-900 dark:text-white">অ্যাডমিনের সাথে সরাসরি চ্যাট ও মেসেজিং</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">যে কোনো প্রশ্ন বা প্রোডাক্ট সংক্রান্ত তথ্যের জন্য অ্যাডমিনকে ছবি সহ মেসেজ পাঠাতে পারেন।</p>
                            </div>
                        </div>

                        {/* চ্যাট মেসেজ হিস্ট্রি */}
                        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50/30 dark:bg-neutral-950/30">
                            {messages && messages.length > 0 ? (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === auth.user.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs shadow-xs space-y-2 ${isMe
                                                ? 'bg-emerald-600 text-white rounded-br-none'
                                                : 'bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-neutral-700'
                                                }`}>
                                                {!isMe && (
                                                    <p className="font-bold text-[10px] text-emerald-600 dark:text-emerald-400 mb-1">
                                                        অ্যাডমিন সাপোর্ট
                                                    </p>
                                                )}
                                                {msg.image && (
                                                    <a href={getImageUrl(msg.image)!} target="_blank" rel="noreferrer" className="block">
                                                        <img
                                                            src={getImageUrl(msg.image)!}
                                                            alt="Attached Image"
                                                            className="w-full max-h-48 object-cover rounded-xl border border-black/10 dark:border-white/10"
                                                        />
                                                    </a>
                                                )}
                                                {msg.message && <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>}
                                                <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                    এখনও কোনো মেসেজ আদান-প্রদান করা হয়নি। প্রথম মেসেজ লিখুন!
                                </div>
                            )}
                        </div>

                        {/* মেসেজ প্রেরণের ইনপুট ও ছবি সংযুক্তি */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2">
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
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="আপনার মেসেজ টাইপ করুন..."
                                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || (!messageText.trim() && !selectedImage)}
                                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" /> {isSending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
