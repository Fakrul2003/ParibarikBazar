import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Search,
    SlidersHorizontal,
    Truck,
    Printer,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Clock
} from 'lucide-react';

interface OrderItem {
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
        sizes?: string;
    };
}

interface Props {
    orders: OrderItem[];
    auth: {
        user: any;
    };
}

export default function Orders({ orders }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
        orders && orders.length > 0 ? orders[0].id : null
    );

    const filteredOrders = (orders || []).filter((o) => {
        const query = searchTerm.toLowerCase();
        return (
            o.id.toString().includes(query) ||
            o.name.toLowerCase().includes(query) ||
            o.phone.includes(query) ||
            (o.product?.name && o.product.name.toLowerCase().includes(query))
        );
    });

    const activeOrder = orders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || null;

    const getImageUrl = (img?: string) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    const handleAccept = (orderId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        router.patch(`/orders/${orderId}/accept`);
    };

    const handleReject = (orderId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        router.patch(`/orders/${orderId}/reject`);
    };

    const handleDeliveryOut = (orderId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        router.patch(`/orders/${orderId}/status`);
    };

    const parseSizes = (sizesJson?: string, defaultSize?: string) => {
        if (!sizesJson) return defaultSize ? `Size: ${defaultSize}` : null;
        try {
            const parsed = JSON.parse(sizesJson);
            if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) {
                return Object.entries(parsed)
                    .map(([sz, qty]) => `Size: ${sz} (Qty: ${qty})`)
                    .join(', ');
            }
        } catch {
            return `Size: ${sizesJson}`;
        }
        return defaultSize ? `Size: ${defaultSize}` : null;
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders - Admin Portal" />

            {/* Top Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage incoming orders and track fulfillment.</p>
            </div>

            {/* 3-Column Orders Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* COLUMN 1: Order List Cards (xl:col-span-4) */}
                <div className="xl:col-span-4 space-y-4">
                    {/* Search & Filter bar */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search order, customer..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                            />
                        </div>
                        <button 
                            type="button" 
                            className="p-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition text-gray-600 dark:text-gray-400 shadow-xs"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Order Cards Scrollable List */}
                    <div className="space-y-3.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const isSelected = activeOrder?.id === order.id;
                                const sizeText = parseSizes(order.sizes_data || order.size_data, order.size);
                                const statusUpper = (order.status || 'PENDING').toUpperCase();

                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => setSelectedOrderId(order.id)}
                                        className={`p-4 bg-white dark:bg-neutral-900 rounded-2xl border transition cursor-pointer shadow-xs relative ${
                                            isSelected
                                                ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-600'
                                                : 'border-gray-200/80 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                                        }`}
                                    >
                                        {/* Card Header: Order # & Status Badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                                                Order #{order.id}
                                            </span>
                                            <span
                                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                                    statusUpper === 'PAID' || statusUpper === 'ACCEPTED'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                        : statusUpper === 'REJECTED' || statusUpper === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                                        : statusUpper === 'OUT FOR DELIVERY'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                }`}
                                            >
                                                {statusUpper}
                                            </span>
                                        </div>

                                        {/* Customer avatar & summary info */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
                                                {order.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{order.name}</p>
                                                <p className="text-xs text-gray-400 truncate">
                                                    {order.address} · {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Product thumbnail preview & Price */}
                                        <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
                                            <div className="flex items-center -space-x-2 overflow-hidden">
                                                {order.product?.image ? (
                                                    <img
                                                        src={getImageUrl(order.product.image)!}
                                                        alt={order.product.name}
                                                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-gray-500 ring-2 ring-white">
                                                        P
                                                    </div>
                                                )}
                                                {sizeText && (
                                                    <span className="text-[10px] text-gray-500 font-medium pl-3 truncate max-w-[140px]">
                                                        {sizeText}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                                                ৳ {order.total_price}
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => handleAccept(order.id, e)}
                                                className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer text-center"
                                            >
                                                Accept order
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleReject(order.id, e)}
                                                className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-400 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
                                            >
                                                Reject order
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl text-center border border-gray-200 dark:border-neutral-800 text-gray-400">
                                No orders found.
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 2: Selected Order Itemized View (xl:col-span-5) */}
                {activeOrder ? (
                    <div className="xl:col-span-5 space-y-5">
                        <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                            
                            {/* Order Header & Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-gray-100 dark:border-neutral-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order #{activeOrder.id}</h2>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(activeOrder.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                            {activeOrder.status || 'PENDING'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={(e) => handleDeliveryOut(activeOrder.id, e)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 rounded-xl text-xs font-semibold transition cursor-pointer border border-amber-200/50"
                                    >
                                        <Truck className="w-3.5 h-3.5" />
                                        <span>Request Pickup</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => window.print()}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer border border-emerald-200/50"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        <span>Print Order</span>
                                    </button>
                                </div>
                            </div>

                            {/* Product Items List */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        {activeOrder.product?.image ? (
                                            <img
                                                src={getImageUrl(activeOrder.product.image)!}
                                                alt={activeOrder.product.name}
                                                className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-neutral-700 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                                                No Img
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                                {activeOrder.product?.name || 'Default Product'}
                                            </p>
                                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                                                SKU: PRD-{activeOrder.product_id || activeOrder.id} · {parseSizes(activeOrder.sizes_data || activeOrder.size_data, activeOrder.size) || 'Standard'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Quantity: {activeOrder.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-base text-gray-900 dark:text-white">
                                            ৳ {activeOrder.total_price}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <button type="button" className="p-1 hover:text-emerald-600 transition"><Edit3 className="w-3.5 h-3.5" /></button>
                                            <button type="button" className="p-1 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subtotal & Totals Box */}
                            <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">৳ {activeOrder.total_price}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Shipping:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">৳ 60.00</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Sales tax:</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">৳ 0.00</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-neutral-800">
                                    <span>Total:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">৳ {(Number(activeOrder.total_price) + 60).toFixed(2)}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="xl:col-span-5 p-8 bg-white dark:bg-neutral-900 rounded-2xl text-center border border-gray-200 text-gray-400">
                        Select an order to view details.
                    </div>
                )}

                {/* COLUMN 3: Customer Info, Payment Card & Timeline (xl:col-span-3) */}
                {activeOrder && (
                    <div className="xl:col-span-3 space-y-5">
                        
                        {/* Customer Info Card */}
                        <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Customer Info</h3>
                                <button type="button" className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                                    <Edit3 className="w-3 h-3" /> Edit
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                                    {activeOrder.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activeOrder.name}</h4>
                                    <p className="text-xs text-gray-400">{activeOrder.address}</p>
                                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">1 Order Recorded</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4 pt-3 border-t border-gray-100 dark:border-neutral-800">
                                <p className="flex items-center gap-2 truncate">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{activeOrder.user?.email || 'customer@example.com'}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Phone: {activeOrder.phone}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button type="button" className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer">
                                    Refund
                                </button>
                                <button type="button" className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-semibold transition cursor-pointer">
                                    Discount
                                </button>
                            </div>
                        </div>

                        {/* Payment Card Graphic */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <CreditCard className="w-6 h-6 opacity-80" />
                                <span className="font-black italic text-xs tracking-widest uppercase">VISA</span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <p className="font-mono text-sm tracking-widest opacity-90">•••• •••• •••• 4567</p>
                            </div>
                            <div className="flex justify-between items-end text-[10px] opacity-80 font-mono">
                                <div>
                                    <p className="uppercase text-[8px] opacity-70">Cardholder</p>
                                    <p className="font-bold">{activeOrder.name}</p>
                                </div>
                                <div>
                                    <p className="uppercase text-[8px] opacity-70">Exp</p>
                                    <p className="font-bold">07/30</p>
                                </div>
                            </div>
                        </div>

                        {/* Order History Timeline */}
                        <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Order History</h3>
                            
                            <div className="relative pl-4 space-y-4 border-l-2 border-emerald-100 dark:border-neutral-800">
                                <div className="relative">
                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -left-[21px] top-1 ring-4 ring-white dark:ring-neutral-900" />
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Order Created</p>
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(activeOrder.created_at || Date.now()).toLocaleString()}
                                    </p>
                                </div>
                                <div className="relative">
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full absolute -left-[21px] top-1 ring-4 ring-white dark:ring-neutral-900" />
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                        Status set to {activeOrder.status || 'PENDING'}
                                    </p>
                                    <p className="text-[10px] text-gray-400">System automated log</p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
