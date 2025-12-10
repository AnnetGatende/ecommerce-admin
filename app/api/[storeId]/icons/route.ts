import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){ 
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is required is required", { status: 400 });
        }

        if(!imageUrl) {
            return new NextResponse("Icon image is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store ID is required is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const icon = await prismadb.icon.create({
            data: {
                name,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(icon);

    } catch (error) {
       console.log('[ICONS_POST]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};

// getting all the icons

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){ 
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID is required is required", { status: 400 });
        }

        const icons = await prismadb.icon.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(icons);

    } catch (error) {
       console.log('[ICONS_GET]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};
export const runtime = "nodejs"