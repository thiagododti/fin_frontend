import { LayoutDashboard, Users, Settings } from 'lucide-react';

export const paths = {
    login: {
        path: '/login',
        title: 'Login',
        showInSidebar: false,
    },
    home: {
        path: '/',
        title: 'Home',
        icon: LayoutDashboard,
        showInSidebar: true,
    },
    configuration: {
        title: 'Configuração',
        icon: Settings,
        showInSidebar: true,
        children: {
            users: {
                path: '/configuration/users',
                title: 'Users',
                icon: Users,
                showInSidebar: true,
            },
        },
    },
    notfound: {
        path: '*',
        title: 'Not Found',
        showInSidebar: false,
    },
    forbidden: {
        path: '/forbidden',
        title: 'Forbidden',
        showInSidebar: false,
    },
} as const;
