"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle";

interface MainNavProps {
    className?: string;
}

export function MainNav({
    className,
    ...props
}: MainNavProps) { 
    console.log("🟢 MainNav rendered");  // ✅ Add this line here

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/${params.storeId}`, 
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathname === `/${params.storeId}/billboards`, 
        },
         {
           href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname === `/${params.storeId}/categories`,
         },    
         {
           href: `/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathname === `/${params.storeId}/sizes`,
         },
          {
           href: `/${params.storeId}/colors`,
            label: 'Colors',
            active: pathname === `/${params.storeId}/colors`,
         }, 
          {
           href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathname === `/${params.storeId}/products`,
         },
         {
           href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathname === `/${params.storeId}/orders`,
         }, 
        {
            href: `/${params.storeId}/Settings`,
            label: 'Settings',
            active: pathname === `/${params.storeId}/Settings`, 
        },
    ];

    return (
      <nav 
  className={cn("flex items-center space-x-8 lg:space-x-10 ml-6", className)} 
  {...props}
>
  {routes.map((route) => ( 
    <Link
      key={route.href}
      href={route.href} 
      className={cn(
        "text-sm transition-colors hover:text-black dark:hover:text-white",
        route.active
          ? "font-extrabold text-black dark:text-white"
          : "font-normal text-muted-foreground"
      )}
    >
      {route.label}
    </Link>
  ))} 
  <ThemeToggle/>
</nav>

    )
}
