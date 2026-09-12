import { Head, Link, usePage, router } from '@inertiajs/react';
import { dashboard } from '@/routes';
import OrdersPage from './admin/Orders';

interface User {
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
        sizes?: string;
    };
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
    orders: Order[];
}

export default function Dashboard() {
    const { auth, orders } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 'admin' || true;

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

    const renderSizeInfo = (order: Order) => {
        const rawData = order.sizes_data || order.size_data || order.size;
        if (!rawData) {
            return <span className="text-gray-400">প্রযোজ্য নয়</span>;
        }

        try {
            const parsed = JSON.parse(rawData);
            if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) {
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
            <div className="px-4 pt-4">
                <h1>Dashboard Overview</h1>
                <Link
                    href="/"
                    className="inline-block px-4 py-2 mt-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                    Home page
                </Link>
            </div>

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* কন্ডিশনাল রেন্ডারিং: অ্যাডমিন নাকি ইউজার */}
                {isAdmin ? (
                    /* =================== অ্যাডমিন প্যানেল =================== */
                    <div className="flex flex-col gap-6">
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">অ্যাডমিন কন্ট্রোল প্যানেল</h2>
                            <p className="text-sm text-blue-600 dark:text-blue-400">স্বাগতম, {auth.user.name}! আপনি সকল ইউজারের অর্ডার ম্যানেজ করতে পারবেন।</p>
                        </div>

                        {/* অ্যাডমিন অর্ডার ম্যানেজমেন্ট টেবিল */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
                                <h3 className="font-bold text-base">সকল কাস্টমার অর্ডার লিস্ট</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-neutral-800 text-xs uppercase text-gray-600 dark:text-gray-300">
                                            <th className="p-3">অর্ডার আইডি</th>
                                            <th className="p-3">কাস্টমার তথ্য (নাম ও ফোন)</th>
                                            <th className="p-3">ঠিকানা</th>
                                            <th className="p-3">প্রোডাক্ট</th>
                                            <th className="p-3">মোট দাম</th>
                                            <th className="p-3">স্ট্যাটাস</th>
                                            <th className="p-3">সাইজ</th>
                                            <th className="p-3">অ্যাকশন</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.length > 0 ? (
                                            orders.map((order) => (
                                                <tr key={order.id} className="border-t border-gray-200 dark:border-neutral-800 text-sm">
                                                    <td className="p-3 font-medium">#{order.id}</td>
                                                    <td className="p-3">
                                                        <div className="font-semibold">{order.name}</div>
                                                        <div className="text-xs text-gray-400">ফোন: {order.phone}</div>
                                                    </td>
                                                    <td className="p-3">{order.address}</td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {order.product?.image ? (
                                                                <img
                                                                    src={getImageUrl(order.product.image)!}
                                                                    alt={order.product.name}
                                                                    className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-xs text-gray-400 shrink-0 border border-gray-200 dark:border-neutral-700">
                                                                    ছবি নেই
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-semibold text-gray-900 dark:text-gray-100">{order.product?.name || 'N/A'}</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">পরিমাণ: {order.quantity} টি</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 font-semibold">৳ {order.total_price}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>

                                                    <td className="p-3">
                                                        {renderSizeInfo(order)}
                                                    </td>
                                                    <td className="p-3">
                                                        {order.status === 'Pending' && (
                                                            <button
                                                                onClick={() => updateStatus(order.id)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                                                            >
                                                                Delivery Out
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="text-center p-4 text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* =================== সাধারণ ইউজার প্যানেল =================== */
                    <div className="flex flex-col gap-6">
                        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <h2 className="text-lg font-bold text-green-800 dark:text-green-300">ইউজার ড্যাশবোর্ড</h2>
                            <p className="text-sm text-green-600 dark:text-green-400">স্বাগতম, {auth.user.name}! আপনার অর্ডার করা পণ্যগুলোর স্ট্যাটাস নিচে দেখতে পাবেন।</p>
                        </div>

                        {/* ইউজারের নিজের অর্ডার হিস্ট্রি টেবিল */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
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
                                            orders.map((order) => (
                                                <tr key={order.id} className="border-t border-gray-200 dark:border-neutral-800 text-sm">
                                                    <td className="p-3 font-medium">#{order.id}</td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {order.product?.image ? (
                                                                <img
                                                                    src={getImageUrl(order.product.image)!}
                                                                    alt={order.product.name}
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
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center p-4 text-gray-500">আপনি এখনও কোনো অর্ডার করেননি।</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

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
