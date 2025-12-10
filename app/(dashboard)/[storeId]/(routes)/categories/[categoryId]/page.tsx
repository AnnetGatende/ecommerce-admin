import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      icon: true, // Include the related icon
    },
  });
  
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    }
  });

  const icons = await prismadb.icon.findMany({
    where: {
      storeId: params.storeId
    }
  }); // Fetch only store-specific icons

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <CategoryForm billboards={billboards} initialData={category} icons={icons} />
      </div>
    </div>
  );
};

export default CategoryPage;
