import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        select: {
            id: true,
            name: true,
            iconId: true,
            createdAt: true,
            billboard: {
                select: {
                    label: true
                }
            },
            icon: {
                select: {
                    imageUrl: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard?.label ?? "No label",
        iconId: item.iconId,
        iconImageUrl: item.icon?.imageUrl ?? "", // Use imageUrl instead of iconvalue
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));
    

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
     );
}
 
export default CategoriesPage;