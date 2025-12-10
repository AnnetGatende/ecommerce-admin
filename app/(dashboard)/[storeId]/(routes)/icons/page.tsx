import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { IconsClient } from "./components/client";
import { IconColumn } from "./components/columns";

const IconsPage = async ({
    params
}: {
    params: { storeId: string }
}
) => {
    const icons = await prismadb.icon.findMany({
        where: {
            storeId: params.storeId
        },
        select: {
            id: true,
            name: true,
            imageUrl: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedIcons: IconColumn[] = icons.map((item) => ({
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <IconsClient data={formattedIcons} />
            </div>
        </div>
     );
}
 
export default IconsPage;