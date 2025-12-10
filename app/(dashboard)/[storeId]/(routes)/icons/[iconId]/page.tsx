import prismadb from "@/lib/prismadb";
import { IconForm } from "./components/icon-form";

const IconPage   = async ({
    params
}: {
    params: { iconId: string }
}) => {

    const icon = await prismadb.icon.findUnique({
        where: {
            id: params.iconId
        }
    })
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6 ">
            <IconForm initialData={icon} />
            </div>
        </div>
     );
}
 
export default IconPage;