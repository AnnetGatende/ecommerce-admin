"use client";
import * as z from "zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {
   Select ,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem
  } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = {
  name: string;
  images: { url: string }[];
  price: number;
  categoryId: string;
  colorId: string;
  sizeId: string;
  isFeatured?: boolean;
  isArchived?: boolean;
};

interface ProductFormProps {
  initialData:
    | ({
        id: string;
        name: string;
        price: number; // number instead of Decimal
        isFeatured: boolean;
        isArchived: boolean;
        categoryId: string;
        sizeId: string;
        colorId: string;
        images: { id: string; url: string }[];
        createdAt?: string;
        updatedAt?: string;
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}


export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData,
  categories,
  colors,
  sizes 
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(initialData.price.toString()),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/products`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using this product first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <Heading title={title} description={description} />
          {initialData && (
            <Button
              disabled={loading}
              size="icon"
              className="bg-red-500 hover:bg-red-600 border-red-500"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4 text-white" />
            </Button>
          )}
        </div>

        <Separator className="bg-gray-300" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!font-bold">Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(newUrls) => {
                        // Use the latest form value to avoid stale updates
                        const current = form.getValues("images") ?? [];

                        // Normalize incoming value to array of strings
                        const incoming = Array.isArray(newUrls)
                          ? newUrls
                          : [newUrls];

                        // Merge without duplicates (keep objects with shape { url })
                        const merged = [
                          ...current,
                          ...incoming
                            .map((url) => ({ url }))
                            .filter(
                              (img) =>
                                !current.some(
                                  (existing) => existing.url === img.url
                                )
                            ),
                        ];

                        // set the updated images array on the form
                        form.setValue("images", merged);
                      }}
                      onRemove={(url) => {
                        const current = form.getValues("images") ?? [];
                        form.setValue(
                          "images",
                          current.filter((img) => img.url !== url)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!font-bold">Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!font-bold">Price</FormLabel>
                    <FormControl>
                      <Input
                      type="number"
                        disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                                   <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="!font-bold">Category</FormLabel> {/* Added font-bold */}
                                   <Select 
                                    disabled={loading}
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value}
                                    >
                                         <FormControl>
                                        <SelectTrigger className="select-trigger">

                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a category"
                                            
                                            />

                                        </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                        {categories?.map((category)=>(
                                            <SelectItem
                                            key={category.id}
                                            value={category.id}
                                            
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                       </SelectContent>

                                   </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                               <FormField
                            control={form.control}
                            name="sizeId"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="!font-bold">Size</FormLabel> {/* Added font-bold */}
                                   <Select 
                                    disabled={loading}
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value}
                                    >
                                        <FormControl>
  <SelectTrigger className="select-trigger">
    <SelectValue
      defaultValue={field.value}
      placeholder="Select a size"
    />
  </SelectTrigger>
</FormControl>

<SelectContent 
  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-md"
>
  {sizes?.map((size) => (
    <SelectItem
      key={size.id}
      value={size.id}
      className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
    >
      {size.name}
    </SelectItem>
  ))}
</SelectContent>


                                   </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                                 <FormField
                            control={form.control}
                            name="colorId"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className="!font-bold">Color</FormLabel> {/* Added font-bold */}
                                   <Select 
                                    disabled={loading}
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value}
                                    >
                                         <FormControl>
                                        <SelectTrigger className="select-trigger">

                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a color"
                                            
                                            />

                                        </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                        {colors?.map((color)=>(
                                            <SelectItem
                                            key={color.id}
                                            value={color.id}
                                            
                                            >
                                                {color.name}
                                            </SelectItem>
                                        ))}
                                       </SelectContent>

                                   </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                          <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
 <FormItem className="rounded-md border p-4">
  <div className="flex items-center gap-3">
    <FormControl>
      <Checkbox 
        checked={field.value}
        onCheckedChange={field.onChange}
      />
    </FormControl>
    <FormLabel className="!font-bold mb-0">
      Featured
    </FormLabel>
  </div>
  <FormDescription className="ml-7">
    This product will appear on the home page
  </FormDescription>
</FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
 <FormItem className="rounded-md border p-4">
  <div className="flex items-center gap-3">
    <FormControl>
      <Checkbox 
        checked={field.value}
        onCheckedChange={field.onChange}
      />
    </FormControl>
    <FormLabel className="!font-bold mb-0">
      Archived
    </FormLabel>
  </div>
  <FormDescription className="ml-7">
    This product will not appear anywhere in the store.
  </FormDescription>
</FormItem>
                )}
              />


                        
            </div>

            <Button
              disabled={loading}
              className="ml-auto bg-primary text-primary-foreground hover:opacity-90"
              type="submit"
            >
              {action}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
