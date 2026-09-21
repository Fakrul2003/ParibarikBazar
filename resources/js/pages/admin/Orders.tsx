import React, { useState, useEffect, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
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
    Clock,
    ChevronDown,
    ChevronUp
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
        image_2?: string;
        image_3?: string;
        sizes?: string;
    };
    products?: any[];
    order_ids?: number[];
}

interface ParsedVariantItem {
    color?: string;
    colorImg?: string;
    size: string;
    qty: any;
    price?: number;
}

interface Props {
    orders: OrderItem[];
    auth?: {
        user: any;
    };
}

export default function Orders({ orders }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const { url } = usePage();

    const getGroupedOrders = (rawOrders: OrderItem[]) => {
        if (!rawOrders || !Array.isArray(rawOrders)) return [];

        const map = new Map<string, OrderItem>();

        rawOrders.forEach(order => {
            if (!order) return;
            const status = (order.status || 'PENDING').toUpperCase();
            const isDeliveredOrCancelled = ['DELIVERED', 'CANCELLED', 'REJECTED'].includes(status);
            const phoneKey = order.phone ? order.phone.trim() : `nophone_${order.id}`;

            const key = isDeliveredOrCancelled ? `single_${order.id}` : `customer_${phoneKey}`;

            if (map.has(key) && !isDeliveredOrCancelled) {
                const existing = map.get(key)!;
                existing.total_price = Number(existing.total_price || 0) + Number(order.total_price || 0);
                existing.quantity = (existing.quantity || 0) + (order.quantity || 1);

                if (!existing.products) existing.products = [];
                if (order.product) {
                    existing.products.push({
                        ...order.product,
                        order_id: order.id,
                        size_data: order.sizes_data || order.size_data || order.size,
                        quantity: order.quantity,
                        total_price: order.total_price
                    });
                }
                if (!existing.order_ids) existing.order_ids = [];
                existing.order_ids.push(order.id);
            } else {
                map.set(key, {
                    ...order,
                    order_ids: [order.id],
                    products: order.product ? [{
                        ...order.product,
                        order_id: order.id,
                        size_data: order.sizes_data || order.size_data || order.size,
                        quantity: order.quantity,
                        total_price: order.total_price
                    }] : []
                });
            }
        });

        return Array.from(map.values());
    };

    const groupedOrders = getGroupedOrders(orders || []);
    const requestedOrderId = Number.parseInt(
        new URL(url, 'http://localhost').searchParams.get('order') || '',
        10
    );
    const requestedOrder = groupedOrders.find((order) =>
        order.id === requestedOrderId || order.order_ids?.includes(requestedOrderId)
    );

    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
        requestedOrder?.id ?? (groupedOrders.length > 0 ? groupedOrders[0].id : null)
    );
    const [expandedMobileOrderId, setExpandedMobileOrderId] = useState<number | null>(
        requestedOrder?.id ?? null
    );
    const [isMobileLayout, setIsMobileLayout] = useState<boolean>(false);

    const orderItemRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    useEffect(() => {
        const updateLayoutMode = () => setIsMobileLayout(window.innerWidth < 1280);

        updateLayoutMode();
        window.addEventListener('resize', updateLayoutMode);

        return () => window.removeEventListener('resize', updateLayoutMode);
    }, []);

    useEffect(() => {
        if (requestedOrderId) {
            setSelectedOrderId(requestedOrderId);
            setExpandedMobileOrderId(requestedOrderId);

            const timer = setTimeout(() => {
                const el = orderItemRefs.current[requestedOrderId];
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [requestedOrderId]);

    const handleCardClick = (orderId: number) => {
        setSelectedOrderId(orderId);
        if (isMobileLayout) {
            setExpandedMobileOrderId(prev => (prev === orderId ? null : orderId));
        }
    };

    const filteredOrders = groupedOrders.filter((o) => {
        const query = searchTerm.toLowerCase();
        return (
            (o.id && o.id.toString().includes(query)) ||
            (o.name && o.name.toLowerCase().includes(query)) ||
            (o.phone && o.phone.includes(query)) ||
            (o.products && o.products.some(p => p.name?.toLowerCase().includes(query))) ||
            (o.product?.name && o.product.name.toLowerCase().includes(query))
        );
    });

    const activeOrder = groupedOrders.find((o) =>
        o.id === selectedOrderId || o.order_ids?.includes(selectedOrderId || 0)
    ) || filteredOrders[0] || null;

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

    const handleDelete = (orderId: number, orderIds?: number[], e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি ডিলিট করতে চান?')) {
            if (orderIds && orderIds.length > 0) {
                orderIds.forEach(id => {
                    router.delete(`/orders/${id}`, { preserveScroll: true });
                });
            } else {
                router.delete(`/orders/${orderId}`, { preserveScroll: true });
            }
        }
    };

    const getParsedSizesList = (
        sizesJson?: string,
        defaultSize?: string,
        productObj?: any
    ): ParsedVariantItem[] => {
        if (!sizesJson) {
            return defaultSize ? [{
                size: defaultSize,
                qty: 1,
                colorImg: productObj?.image ? getImageUrl(productObj.image) || undefined : undefined
            }] : [];
        }

        try {
            const parsed = JSON.parse(sizesJson);
            if (parsed && typeof parsed === 'object') {
                const variantsArray = Array.isArray(parsed.variants)
                    ? parsed.variants
                    : Array.isArray(parsed)
                    ? parsed
                    : null;

                if (variantsArray) {
                    return variantsArray.map((v: any, vIdx: number) => {
                        let cImg = v.colorImg || v.color_img || v.image;
                        if (!cImg && productObj) {
                            if (vIdx === 0 && productObj.image) cImg = productObj.image;
                            else if (vIdx === 1 && productObj.image_2) cImg = productObj.image_2;
                            else if (vIdx === 2 && productObj.image_3) cImg = productObj.image_3;
                            else if (productObj.image) cImg = productObj.image;
                        }
                        return {
                            color: v.color || v.colorName,
                            colorImg: cImg ? getImageUrl(cImg) || cImg : undefined,
                            size: v.size || 'N/A',
                            qty: v.quantity || v.qty || 1,
                            price: v.price
                        };
                    });
                }

                if (Object.keys(parsed).length > 0) {
                    return Object.entries(parsed).map(([sz, qty]) => ({
                        size: sz,
                        qty,
                        colorImg: productObj?.image ? getImageUrl(productObj.image) || undefined : undefined
                    }));
                }
            }
        } catch {
            return [{
                size: sizesJson,
                qty: 1,
                colorImg: productObj?.image ? getImageUrl(productObj.image) || undefined : undefined
            }];
        }

        return defaultSize ? [{
            size: defaultSize,
            qty: 1,
            colorImg: productObj?.image ? getImageUrl(productObj.image) || undefined : undefined
        }] : [];
    };

    // অর্ডারের গ্রাহক তথ্য (Customer Info Card)
    const renderCustomerInfoBlock = (order: OrderItem) => (
        <div className="p-4 bg-gray-50/70 dark:bg-neutral-800/40 rounded-xl border border-gray-200/70 dark:border-neutral-700/70 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Customer Info
                </h3>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    {order.order_ids?.length || 1} Order(s) Grouped
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {(order.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{order.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                        <span className="truncate">{order.address}</span>
                    </p>
                </div>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200/60 dark:border-neutral-700/60">
                <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{order.user?.email || 'customer@example.com'}</span>
                </p>
                <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Phone: <strong>{order.phone}</strong></span>
                </p>
            </div>
        </div>
    );

    const renderOrderDetailPanel = (order: OrderItem | null, isMobileView: boolean = false) => {
        if (!order) {
            return (
                <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl text-center border border-gray-200 text-gray-400">
                    Select an order to view details.
                </div>
            );
        }

        return (
            <div className={`p-4 md:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs space-y-5`}>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                                {order.order_ids && order.order_ids.length > 1
                                    ? `Orders #${order.order_ids.join(', #')}`
                                    : `Order #${order.id}`}
                            </h2>
                            <span className="text-xs text-gray-400 font-medium">
                                {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                {order.status || 'PENDING'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => handleDeliveryOut(order.id, e)}
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
                            <span>Print</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleDelete(order.id, order.order_ids, e)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 rounded-xl text-xs font-semibold transition cursor-pointer border border-red-200/50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* মোবাইল ভিউতে Customer Info সবার উপরে প্রদর্শিত হবে */}
                {isMobileView && renderCustomerInfoBlock(order)}

                {/* প্রোডাক্ট তালিকা */}
                <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Order Items
                    </h3>
                    {order.products && order.products.length > 0 ? (
                        order.products.map((prod, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50/70 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800 gap-3">
                                <div className="flex items-start gap-3 min-w-0 w-full">
                                    {prod.image ? (
                                        <img
                                            src={getImageUrl(prod.image)!}
                                            alt={prod.name}
                                            className="w-12 h-12 object-cover rounded-xl border border-gray-200 dark:border-neutral-700 shrink-0 mt-0.5"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">
                                            No Img
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                            {prod.name || 'Default Product'}
                                        </p>
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                                            SKU: PRD-{prod.id || idx}
                                        </p>

                                        <div className="mt-2 space-y-1">
                                            {getParsedSizesList(prod.size_data, prod.size, prod).map((item, sIdx) => (
                                                <div
                                                    key={sIdx}
                                                    className="flex items-center gap-2 p-1 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200/80 dark:border-neutral-700/80 text-[11px]"
                                                >
                                                    {item.colorImg ? (
                                                        <img
                                                            src={item.colorImg}
                                                            alt={item.color || 'variant'}
                                                            className="w-6 h-6 object-cover rounded border border-gray-200 dark:border-neutral-700 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[9px] font-bold shrink-0">
                                                            🎨
                                                        </div>
                                                    )}
                                                    <div className="flex-1 flex flex-wrap items-center gap-x-2 min-w-0">
                                                        {item.color && (
                                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                                কালার: <span className="text-emerald-600 dark:text-emerald-400">{item.color}</span>
                                                            </span>
                                                        )}
                                                        <span className="text-gray-600 dark:text-gray-300">
                                                            সাইজ: <strong>{item.size}</strong>
                                                        </span>
                                                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                                            (পরিমাণ: {item.qty})
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                                            Total Qty: <span className="font-semibold text-gray-700 dark:text-gray-300">{prod.quantity}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 dark:border-neutral-700">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                                        ৳ {prod.total_price}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl text-center text-xs text-gray-500">
                            No item details available.
                        </div>
                    )}
                </div>

                {/* হিসেব নিকেশ */}
                <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 space-y-1.5 text-xs md:text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Subtotal:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">৳ {order.total_price}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Shipping:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">৳ 60.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm md:text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-neutral-800">
                        <span>Total:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">৳ {(Number(order.total_price || 0) + 60).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders - Admin Portal" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage incoming orders and track fulfillment.</p>
            </div>

            {isMobileLayout ? (
                /* মোবাইল ভিউ: প্রতি কার্ডে টগল হয়ে Customer Info ও অর্ডারের বিশদ তথ্য দেখাবে */
                <div className="space-y-4 min-h-0">
                    <div className="flex items-center gap-2 mb-3">
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
                    </div>

                    <div className="space-y-3.5">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const isSelected = selectedOrderId === order.id;
                                const isExpanded = expandedMobileOrderId === order.id;
                                const statusUpper = (order.status || 'PENDING').toUpperCase();
                                const displayIds = order.order_ids && order.order_ids.length > 1
                                    ? `Orders #${order.order_ids.join(', #')}`
                                    : `Order #${order.id}`;

                                return (
                                    <div
                                        key={order.id}
                                        ref={(node) => {
                                            if (node) orderItemRefs.current[order.id] = node;
                                        }}
                                        className="rounded-2xl border bg-white dark:bg-neutral-900 shadow-xs overflow-hidden transition"
                                    >
                                        <div
                                            onClick={() => handleCardClick(order.id)}
                                            className={`p-4 cursor-pointer ${
                                                isSelected
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-600'
                                                    : 'border-gray-200/80 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[180px]">
                                                    {displayIds}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                                        statusUpper === 'DELIVERED' || statusUpper === 'PAID' || statusUpper === 'ACCEPTED'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : statusUpper === 'REJECTED' || statusUpper === 'CANCELLED'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                                            : statusUpper === 'OUT FOR DELIVERY'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                    }`}>
                                                        {statusUpper}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        title="Delete Order"
                                                        onClick={(e) => handleDelete(order.id, order.order_ids, e)}
                                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-950 text-red-500 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
                                                    {(order.name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{order.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {order.address} · {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className="text-gray-400">
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    {order.products?.length || 1} item(s)
                                                </span>
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">
                                                    ৳ {order.total_price}
                                                </span>
                                            </div>

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

                                        {/* মোবাইলে কলাপ্স হয়ে নিচে ওপেন হওয়া অংশ (Customer Info সহ) */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-200 dark:border-neutral-800 bg-gray-50/40 dark:bg-neutral-950/50 p-2">
                                                {renderOrderDetailPanel(order, true)}
                                            </div>
                                        )}
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
            ) : (
                /* ডেস্কটপ ভিউ: ৩ কলাম লেআউট */
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start min-h-0">
                    <div className="xl:col-span-4 space-y-4 min-h-0">
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

                        <div className="space-y-3.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const isSelected = activeOrder?.id === order.id;
                                    const statusUpper = (order.status || 'PENDING').toUpperCase();
                                    const displayIds = order.order_ids && order.order_ids.length > 1
                                        ? `Orders #${order.order_ids.join(', #')}`
                                        : `Order #${order.id}`;

                                    return (
                                        <div
                                            key={order.id}
                                            ref={(node) => {
                                                if (node) orderItemRefs.current[order.id] = node;
                                            }}
                                            onClick={() => handleCardClick(order.id)}
                                            className={`p-4 bg-white dark:bg-neutral-900 rounded-2xl border transition cursor-pointer shadow-xs relative ${
                                                isSelected
                                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-600'
                                                    : 'border-gray-200/80 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[180px]">
                                                    {displayIds}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                                        statusUpper === 'DELIVERED' || statusUpper === 'PAID' || statusUpper === 'ACCEPTED'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : statusUpper === 'REJECTED' || statusUpper === 'CANCELLED'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                                            : statusUpper === 'OUT FOR DELIVERY'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                    }`}>
                                                        {statusUpper}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        title="Delete Order"
                                                        onClick={(e) => handleDelete(order.id, order.order_ids, e)}
                                                        className="p-1 hover:bg-red-100 dark:hover:bg-red-950 text-red-500 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 dark:border-emerald-800">
                                                    {(order.name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{order.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {order.address} · {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    {order.products?.length || 1} item(s)
                                                </span>
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">
                                                    ৳ {order.total_price}
                                                </span>
                                            </div>

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

                    <div className="xl:col-span-5 space-y-5 min-h-0">
                        {renderOrderDetailPanel(activeOrder, false)}
                    </div>

                    {activeOrder && (
                        <div className="xl:col-span-3 space-y-5 min-h-0 max-h-[calc(100vh-170px)] overflow-y-auto pr-1">
                            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Customer Info</h3>
                                    <button type="button" className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                                        <Edit3 className="w-3 h-3" /> Edit
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                                        {(activeOrder.name || 'C').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activeOrder.name}</h4>
                                        <p className="text-xs text-gray-400">{activeOrder.address}</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                            {activeOrder.order_ids?.length || 1} Order(s) Grouped
                                        </p>
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

                            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Order History</h3>

                                <div className="relative pl-4 space-y-4 border-l-2 border-emerald-100 dark:border-neutral-800">
                                    <div className="relative">
                                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute -left-[21px] top-1 ring-4 ring-white dark:ring-neutral-900" />
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Orders Combined & Created</p>
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
            )}
        </AdminLayout>
    );
}
