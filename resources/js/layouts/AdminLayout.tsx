import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    FileText,
    MessageSquare,
    Home,
    LogOut,
    User as UserIcon,
    Shield
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: Props) {
    const { url, props } = usePage();
    const user = props.auth?.user as { name?: string; email?: string } | undefined;

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, pattern: '/admin/dashboard' },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, pattern: '/admin/orders' },
        { name: 'Invoices', href: '/admin/invoices', icon: FileText, pattern: '/admin/invoices' },
        { name: 'Messages', href: '/admin/messages', icon: MessageSquare, pattern: '/admin/messages' },
    ];

    const isActive = (itemPattern: string) => {
        if (itemPattern === '/admin/orders' && (url === '/dashboard' || url === '/admin/orders' || url === '/')) {
            return url.includes('/admin/orders') || url === '/dashboard';
        }
        return url.startsWith(itemPattern);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50/70 font-sans text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-gray-200/80 bg-white flex flex-col justify-between dark:border-neutral-800 dark:bg-neutral-900 select-none">
                <div className="p-6">
                    {/* Portal Brand Logo */}
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Portal</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.pattern);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold shadow-xs'
                                            : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800/60 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions & User Profile */}
                <div className="p-4 border-t border-gray-100 dark:border-neutral-800/80 space-y-3">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                        <Home className="w-4 h-4 text-gray-400" />
                        <span>Go to Customer Website</span>
                    </Link>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-800/60 border border-gray-100 dark:border-neutral-700/50">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@portal.com'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
               <div className="p-6 md:p-8 flex-1 overflow-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
