"use client";
import * as z from "zod";

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
// import { ApiAlert } from "@/components/ui/api-alert";
// import { useOrigin } from "@/hooks/use-origin"; 
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.array(
    z.object({
      url: z.string().min(1),
      colorId: z.string().nullable(),
    })
  ).min(1),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colors: z.array(z.string().min(1)).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: (Product & {
    images: Image[];
    sizes: Size[];
    colors: Color[];
  }) | null;
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
  const description = initialData ? "Edit product" : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      images: initialData.images.map((image) => ({
        url: image.url,
        colorId: image.colorId ?? null,
      })),
      price: parseFloat(String(initialData?.price)),
      categoryId: initialData.categoryId,
      colors: initialData.colors.map((color) => color.id),
      sizes: initialData.sizes.map((size) => size.id),
      isFeatured: initialData.isFeatured,
      isArchived: initialData.isArchived,
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colors: [],
      sizes: [],
      isFeatured: false,
      isArchived: false,
    }
  });
  const selectedColors = form.watch("colors");

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted Deleted',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      toast.error("Something went wrong.");
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full" >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => {
              const availableColors = colors.filter((color) =>
                selectedColors?.includes(color.id)
              );

              return (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) =>
                        field.onChange([...field.value, { url, colorId: null }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  {field.value.length > 0 && (
                    <div className="space-y-3">
                      {field.value.map((image, index) => (
                        <div
                          key={image.url}
                          className="flex items-center gap-3"
                        >
                          <span className="truncate text-sm flex-1">
                            {image.url}
                          </span>
                          <Select
                            disabled={loading}
                            value={image.colorId || "none"}// ← CHANGED: Use "none" instead of ""
                            onValueChange={(value) => {
                              const updatedImages = [...field.value];
                              updatedImages[index] = {
                                ...updatedImages[index],
                                colorId: value === "none" ? null : value,// ← CHANGED: Convert "none" back to null 
                              };
                              field.onChange(updatedImages);
                            }}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                             <SelectItem value="none">No color</SelectItem> {/* ← CHANGED: "none" instead of "" */}
                              {availableColors.map((color) => (
                                <SelectItem key={color.id} value={color.id}>
                                  {color.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="499.99"
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        ></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Sizes</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((size) => {
                      const isSelected = field.value?.includes(size.id);
                      return (
                        <div
                          key={size.id}
                          className="flex items-center space-x-2 rounded-md border p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), size.id]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== size.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="text-sm">
                            <div className="font-medium">{size.name}</div>
                            <div className="text-muted-foreground">
                              {size.value}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Colors</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {colors.map((color) => {
                      const isSelected = field.value?.includes(color.id);
                      return (
                        <div
                          key={color.id}
                          className="flex items-center space-x-2 rounded-md border p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), color.id]);
                                } else {
                                  const nextColors = (field.value || []).filter(
                                    (value) => value !== color.id
                                  );
                                  field.onChange(nextColors);

                                  const currentImages = form.getValues("images");
                                  form.setValue(
                                    "images",
                                    currentImages.map((image) =>
                                      image.colorId === color.id
                                        ? { ...image, colorId: null }
                                        : image
                                    ),
                                    { shouldValidate: true }
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{color.name}</span>
                            <div
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: color.value }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This Product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
                        <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This Product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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
