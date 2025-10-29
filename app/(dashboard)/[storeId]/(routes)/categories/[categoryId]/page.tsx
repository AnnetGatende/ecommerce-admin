import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}: {
    params: Promise<{ categoryId: string, storeId: string }> // ✅ Changed: Added Promise<>
}) => {
    const { categoryId, storeId } = await params; // ✅ Changed: Await params and destructure

    const category = await prismadb.category.findUnique({
        where: {
            id: categoryId // ✅ Changed: Use destructured variable
        }
    });

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: storeId // ✅ Changed: Use destructured variable
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm
                    billboards={billboards}
                    initialData={category} />
            </div>
        </div>
    );
}
export default CategoryPage;