"use client";
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuItem, 
    DropdownMenuTrigger
 } from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Edit } from "lucide-react";
import { Copy } from "lucide-react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps{
    data:BillboardColumn;
};

export const CellAction:React.FC<CellActionProps>=({
    data
})=>{
    const router= useRouter();
    const params=useParams();

    const[loading,setLoading]=useState(false);
    const[open,setOpen]=useState(false);



    const onCopy=(id: string)=>{
       navigator.clipboard.writeText(id);
       toast.success("Billboard Id copied to the clipnoard.");
    };

    const onDelete= async()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            toast.success("Billboard deleted.");
        }catch(error){
            toast.error("make sure you removed all  categories using this billboard first.");
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }
    return(
      <>
      <AlertModal
      isOpen={open}
      onClose={()=>setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
      
      
      />
     <DropdownMenu>
  
 <DropdownMenuTrigger asChild>
  <Button className="!bg-transparent !hover:bg-transparent h-8 w-8 p-0 rounded flex items-center justify-center dropdown-trigger">
    <span className="sr-only">Open menu</span>
    <MoreHorizontal className="h-4 w-4 text-black dark:text-white" />
  </Button>
</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-white z-50">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>

          <DropdownMenuItem onClick={()=>onCopy(data.id)}>
             <Copy className="mr-2 h-4 w-4"/>
             Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={()=>router.push(`/${params.storeId}/billboards/${data.id}`)}>
             <Edit className="mr-2 h-4 w-4"/>
             Update
          </DropdownMenuItem>
           <DropdownMenuItem onClick={()=>setOpen(true)}>
             <Trash className="mr-2 h-4 w-4"/>
             Delete
          </DropdownMenuItem>

        </DropdownMenuContent>
     </DropdownMenu>
     </>
    );
};