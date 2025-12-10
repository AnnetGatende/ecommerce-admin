"use client";

import { 
  Settings,
  Package,
  CreditCard,
  BarChart3,
  Image,
  Palette,
  Ruler,
  Star,
  Activity
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import StoreSwitcher from "@/components/store-switcher";

interface AppSidebarProps {
  stores: any[]; // Replace with your store type
}

export function AppSidebar({ stores }: AppSidebarProps) {
  const pathname = usePathname();
  const params = useParams();

  // Define your menu items to match your MainNav routes exactly
  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      icon: BarChart3,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'Billboards',
      icon: Image,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      icon: Package,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      icon: Ruler,
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/icons`,
      label: 'Icons',
      icon: Star,
      active: pathname === `/${params.storeId}/icons`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      icon: Palette,
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      icon: Package,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      icon: CreditCard,
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      icon: Settings,
      active: pathname === `/${params.storeId}/settings`,
    },
    {
      href: `/${params.storeId}/tracker`,
      label: 'Tracker',
      icon: Activity,
      active: pathname === `/${params.storeId}/tracker`,
    },
  ];

  // Group routes for better organization
  const mainRoutes = routes.slice(0, 1); // Overview
  const storeManagementRoutes = routes.slice(1, 8); // Billboards to Orders
  const systemRoutes = routes.slice(8); // Settings and Tracker

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3.5">
        <StoreSwitcher items={stores} />
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={route.href}
                      className={cn(
                        route.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      <route.icon />
                      <span>{route.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Store Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Store Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storeManagementRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={route.href}
                      className={cn(
                        route.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      <route.icon />
                      <span>{route.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={route.href}
                      className={cn(
                        route.active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
                      )}
                    >
                      <route.icon />
                      <span>{route.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center space-x-2">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium">Account</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}