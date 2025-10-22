"use client";

import { Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
};

const variantMap: Record<ApiAlertProps["variant"], "secondary" | "destructive" | "default" | "outline"> = {
    public: "secondary",
    admin: "destructive"
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public",
}) => {

    const onCopy=()=>{
       navigator.clipboard.writeText(description);
       toast.success("API Route copied to the clipboard.");
    };
    
    return (
        <Alert className="bold">
            <Server className="h-4 w-4 font-bold"/>
            <AlertTitle className="flex items-center gap-x-2 font-bold">
                {title}
<Badge
  variant={variantMap[variant]}
  className={`
    !rounded-full !px-4 !py-1.5 !font-semibold text-xs !leading-none
    ${variant === "public" ? "!bg-blue-50 !text-black" : "!bg-red-500 !text-white"}
  `}
>




                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 font-semibold">
                <div className="flex items-center justify-between gap-2 w-full">
                    <code className="url-display truncate font-bold">
                        {description}
                    </code>
                    <Button 
                        size="icon" 
                        onClick={onCopy} 
                        className="flex-shrink-0 !bg-white hover:!bg-gray-50 !text-black !border !border-black"
                    >
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}