import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { paths } from '@/routes/paths';

export function NavMain() {
    const location = useLocation();

    const navigation = Object.values(paths).filter((item) => item.showInSidebar);

    return (
        <SidebarMenu>
            {navigation.map((item) => {
                const Icon = item.icon;

                if ('children' in item) {
                    return (
                        <Collapsible key={item.title} defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        {Icon && <Icon />}

                                        <span>{item.title}</span>

                                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {Object.values(item.children).map((child) => (
                                            <SidebarMenuSubItem key={child.path}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={location.pathname === child.path}
                                                >
                                                    <Link to={child.path}>
                                                        {child.icon && <child.icon />}

                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                            <Link to={item.path}>
                                {Icon && <Icon />}

                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
