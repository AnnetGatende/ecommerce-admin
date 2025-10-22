"use client";
import {useState,useEffect} from "react"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';

import { ImagePlus } from "lucide-react";


interface ImageUploadProps{
    disabled?:boolean;
    onChange:(value:string)=>void;
    onRemove:(value:string)=>void;
    value:string[];
}

interface CloudinaryUploadResult {
  info: {
    secure_url: string;
  };
}
const ImageUpload:React.FC<ImageUploadProps>=({
     disabled,
    onChange,
    onRemove,
    value

})=>{
     const [isMounted, setisMounted] = useState(false);
    
        useEffect(() => {
            setisMounted(true);
        }, []);
      
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onUpload = (result: any) => {
  onChange(result.info.secure_url);
}

  if(!isMounted){
            return null;
        }
    
    return(
        <div>
          <div className="mb-4 flex items-center gap-4">
           {value.map((url)=>(
            <div key={url}className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
           <Button 
  type="button" 
  onClick={()=>onRemove(url)} 
  size="icon"
  className="!bg-red-600 hover:!bg-red-700 !text-white"
>
  <Trash className="h-4 w-4"/>
</Button>
              </div>
              <Image
              fill
              className="object-cover"
              alt="image"
              src={url}
              
              
              />
            </div>
           ))}
          </div>
          <CldUploadWidget onSuccess={onUpload} uploadPreset="annett">
            {({open})=>{
              const onClick=()=>{
                open();
              }
              return(
                <Button
                type="button"
                disabled={disabled}
                className="!bg-blue-100 hover:!bg-blue-200 !text-black"
                onClick={onClick}                
                >
                  <ImagePlus className="h-4 w-4 mr-2"/>
                  Upload an Image
                </Button>
              )
            }}
          </CldUploadWidget>
          
        </div>
    )
};
export default ImageUpload;