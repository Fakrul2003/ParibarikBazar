import React, { useEffect, useState } from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function ClientToaster() {
    const [Toaster, setToaster] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        import('@/components/ui/sonner').then(({ Toaster: LoadedToaster }) => {
            setToaster(() => LoadedToaster);
        });
    }, []);

    return Toaster ? <Toaster /> : null;
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name.startsWith('admin/'):
                return null;
           case name === 'productDetails':
            return null;
             case name === 'dashboard':
            return null;
           case name === 'navOption/About':
            return null;
             case name === 'navOption/Faqs':
            return null;
            case name === 'navOption/Wishlists':
            return null;
            case name === 'Category/Show':
            return null;


                default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <ClientToaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
