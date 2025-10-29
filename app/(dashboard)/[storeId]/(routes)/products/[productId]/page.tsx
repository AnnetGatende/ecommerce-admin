import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: { images: true },
  });

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
  });

  // ✅ Fully safe serialization for client
  const serializedProduct = product
    ? JSON.parse(
        JSON.stringify({
          ...product,
          price: product.price.toNumber(),
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        })
      )
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={serializedProduct} // ✅ this is what fixes the error
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
