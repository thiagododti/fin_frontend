import type { LucideIcon } from 'lucide-react';

export type AppRoute = {
    path: string;
    title: string;

    icon?: LucideIcon;

    showInSidebar?: boolean;

    element: React.ReactNode;
};
