import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { FileText, Download, Printer, CheckCircle, Clock } from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    phone: string;
    total_price: number;
    status: string;
    created_at: string;
    product?: {
        name: string;
    };
}

interface Props {
    orders?: OrderItem[];
}

export default function Invoices({ orders = [] }: Props) {
    return (
        <AdminLayout title="Invoices">
            <Head title="Invoices - Admin Portal" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate, view, and print customer billing statements.</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <h2 className="font-bold text-base text-gray-900 dark:text-white">Billing Invoices Log</h2>
                    <button 
                        type="button" 
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-neutral-800/60 text-xs font-bold text-gray-400 uppercase">
                                <th className="p-3.5">Invoice #</th>
                                <th className="p-3.5">Customer</th>
                                <th className="p-3.5">Date</th>
                                <th className="p-3.5">Amount</th>
                                <th className="p-3.5">Status</th>
                                <th className="p-3.5">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40">
                                    <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        INV-2026-{order.id.toString().padStart(4, '0')}
                                    </td>
                                    <td className="p-3.5">
                                        <div className="font-semibold text-gray-900 dark:text-white">{order.name}</div>
                                        <div className="text-xs text-gray-400">{order.phone}</div>
                                    </td>
                                    <td className="p-3.5 text-xs text-gray-500">
                                        {new Date(order.created_at || Date.now()).toLocaleDateString()}
                                    </td>
                                    <td className="p-3.5 font-bold text-gray-900 dark:text-white">৳ {order.total_price}</td>
                                    <td className="p-3.5">
                                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                                            PAID
                                        </span>
                                    </td>
                                    <td className="p-3.5">
                                        <button 
                                            type="button" 
                                            onClick={() => window.print()}
                                            className="p-2 text-gray-500 hover:text-emerald-600 transition"
                                            title="Print Invoice"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </button>
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
