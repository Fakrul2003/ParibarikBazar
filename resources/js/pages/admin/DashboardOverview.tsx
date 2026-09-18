import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    DollarSign,
    ShoppingBag,
    Package,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    total_price: number;
    status: string;
    created_at: string;
    product?: {
        name: string;
    };
}

interface Props {
    orders?: OrderItem[];
    productsCount?: number;
    totalSales?: number;
}

export default function DashboardOverview({ orders = [], productsCount = 0, totalSales = 0 }: Props) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    const stats = [
        { name: 'Total Revenue', value: `৳ ${totalSales.toLocaleString()}`, change: '+14.2%', isPos: true, icon: DollarSign },
        { name: 'Total Orders', value: totalOrders, change: '+8.1%', isPos: true, icon: ShoppingBag },
        { name: 'Products Stocked', value: productsCount, change: '+4.0%', isPos: true, icon: Package },
        { name: 'Pending Fulfillment', value: pendingOrders, change: '-2.5%', isPos: false, icon: TrendingUp },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <Head title="Dashboard Overview - Admin Portal" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to your store control center.</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{stat.name}</span>
                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                                <span className={`text-xs font-bold flex items-center ${stat.isPos ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {stat.isPos ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                        View all orders →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-neutral-800 text-xs font-bold text-gray-400 uppercase">
                                <th className="py-3 px-2">Order ID</th>
                                <th className="py-3 px-2">Customer</th>
                                <th className="py-3 px-2">Product</th>
                                <th className="py-3 px-2">Amount</th>
                                <th className="py-3 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {orders.slice(0, 5).map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => router.visit(`/admin/orders?order=${order.id}`)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            router.visit(`/admin/orders?order=${order.id}`);
                                        }
                                    }}
                                    tabIndex={0}
                                    role="link"
                                    className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                                >
                                    <td className="py-3.5 px-2 font-bold">#{order.id}</td>
                                    <td className="py-3.5 px-2 font-medium">{order.name}</td>
                                    <td className="py-3.5 px-2 text-gray-500">{order.product?.name || 'N/A'}</td>
                                    <td className="py-3.5 px-2 font-bold text-gray-900 dark:text-white">৳ {order.total_price}</td>
                                    <td className="py-3.5 px-2">
                                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                                            (order.status || 'PENDING').toUpperCase() === 'DELIVERED' || (order.status || 'PENDING').toUpperCase() === 'PAID'
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                : (order.status || 'PENDING').toUpperCase() === 'OUT FOR DELIVERY'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                                : (order.status || 'PENDING').toUpperCase() === 'REJECTED' || (order.status || 'PENDING').toUpperCase() === 'CANCELLED'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                        }`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
