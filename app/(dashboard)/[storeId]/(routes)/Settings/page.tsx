import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/setting-form";

interface SettingsPageProps{
    params: Promise<{
        storeId: string;
    }>; // params is now a Promise
};

const SettingsPage: React.FC<SettingsPageProps> = async({
    params
}) => {
    const { userId } = await auth();
    const { storeId } = await params; // Await params first

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId, // Use awaited storeId
            userId
        }
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    );
}

export default SettingsPage;