"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"


interface MainNavProps {
    className?: string;
}

export function MainNav({
    className,
    ...props
}: MainNavProps) { 
    const pathname = usePathname();
    const params = useParams();

    const routes = [{
        href: `/${params.storeId}/Settings`,
        label: 'Settings',
        active: pathname === `/${params.storeId}/settings`, 
    }];

    return(
        <nav 
         className={cn("flex items-center space-x-8 lg:space-x-10 ml-6", className)} 
    {...props}
        >
            {routes.map((route) => ( 
                <Link
                    key={route.href}
                    href={route.href} 
            
 className={cn(
    "text-sm font-medium transition-colors hover:text-black", 
    route.active ? "text-black dark:text-white" : "text-muted-foreground"
)}
                   >
                
                    {route.label}
                </Link>
            ))} 
        </nav>
    )
}