"use client";
import * as z from "zod";

import { FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Icon } from "@prisma/client";
import IconUpload from "@/components/ui/icon-upload";
import { ImageIcon } from "@/components/ui/image-icon";

const formSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1, { message: "Please upload an icon image" }),
});


type IconFormValues = z.infer<typeof formSchema>;

interface IconFormProps {
  initialData: Icon | null;
}

export const IconForm: React.FC<IconFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Icon" : "Create Icon";
  const description = initialData ? "Edit the icon" : "Add a new icon";
  const toastMessage = initialData ? "Icon updated." : "Icon created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<IconFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: IconFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/icons/${params.iconId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/icons`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/icons`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/icons/${params.iconId}`);
      router.refresh();
      router.push(`/${params.storeId}/icons`);
      toast.success("Icon deleted",  {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Make sure to remove all references to this icon first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
            <FaTrash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Icon name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Image</FormLabel>
                  <FormControl>
                    <IconUpload
                      value={field.value}
                      disabled={loading}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};




// "use client";
// import * as z from "zod";

// import { Trash } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import axios from "axios";

// import { Button } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import toast from "react-hot-toast";
// import { useParams, useRouter } from "next/navigation";
// import { AlertModal } from "@/components/modals/alert-modal";
// import * as LucideIcons from "lucide-react";

// const formSchema = z.object({
//   name: z.string().min(1),
//   iconvalue: z.string().min(1, { message: "Enter a valid icon name" }),
// });

// type IconFormValues = z.infer<typeof formSchema>;

// interface IconFormProps {
//   initialData: { name: string; icon: string } | null;
// }

// const IconPreview = ({ iconName }: { iconName: string }) => {
//   const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];

//   // Check if the IconComponent is a valid React component
//   if (!IconComponent || typeof IconComponent !== "function") {
//     return <span className="text-gray-500">Invalid Icon</span>;
//   }

//   // Assert that IconComponent is a valid React component type
//   const ReactIconComponent = IconComponent as React.ComponentType<{ className?: string }>;

//   return <ReactIconComponent className="h-6 w-6" />;
// };



// export const IconForm: React.FC<IconFormProps> = ({ initialData }) => {
//   const params = useParams();
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const title = initialData ? "Edit Icon" : "Create Icon";
//   const description = initialData ? "Edit the icon" : "Add a new icon";
//   const toastMessage = initialData ? "Icon updated." : "Icon created.";
//   const action = initialData ? "Save changes" : "Create";

//   const form = useForm<IconFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData || {
//       name: "",
//       iconvalue: "",
//     },
//   });

//   const onSubmit = async (data: IconFormValues) => {
//     try {
//       setLoading(true);
//       if (initialData) {
//         await axios.patch(`/api/${params.storeId}/icons/${params.iconId}`, data);
//       } else {
//         await axios.post(`/api/${params.storeId}/icons`, data);
//       }
//       router.refresh();
//       router.push(`/${params.storeId}/icons`);
//       toast.success(toastMessage);
//     } catch (error) {
//       toast.error("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onDelete = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(`/api/${params.storeId}/icons/${params.iconId}`);
//       router.refresh();
//       router.push(`/${params.storeId}/icons`);
//       toast.success("Icon Deleted", {
//         style: {
//           borderRadius: "10px",
//           background: "#333",
//           color: "#fff",
//         },
//       });
//     } catch (error) {
//       toast.error("Make sure to remove all references to this icon first.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
//           <div className="grid grid-cols-3 gap-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input disabled={loading} placeholder="Icon name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="iconvalue"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Icon</FormLabel>
//                   <FormControl>
//                     <div className="flex items-center gap-x-4">
//                       <Input disabled={loading} placeholder="Enter icon name" {...field} />
//                       <div className="p-2 border rounded-md">
//                         <IconPreview iconName={field.value} />
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <Button disabled={loading} className="ml-auto" type="submit">
//             {action}
//           </Button>
//         </form>
//       </Form>
//     </>
//   );
// };
