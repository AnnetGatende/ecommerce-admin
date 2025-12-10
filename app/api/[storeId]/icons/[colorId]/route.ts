import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    { params }: { params: { iconId: string } }
) {
    try {

        if (!params.iconId) {
            return new NextResponse("Icon Id required", { status: 400 });
        }

        const icon= await prismadb.icon.findUnique({
            where: {
                id: params.iconId,
            },
        });

        return NextResponse.json(icon);
    } catch (error) {
        console.log('[ICON_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, iconId: string, } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, imageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Icon image URL is required", { status: 400 });
        }

        if (!params.iconId) {
            return new NextResponse("Icon Id required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const icon = await prismadb.icon.updateMany({
            where: {
                id: params.iconId,
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(icon);
    } catch (error) {
        console.log('ICON_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, iconId: string, } }
) {
    try {
        const { userId } = auth();
       


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.iconId) {
            return new NextResponse("Icon Id required", { status: 400 });
        }


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const icon= await prismadb.icon.deleteMany({
            where: {
                id: params.iconId,
            },
        });

        return NextResponse.json(icon);
    } catch (error) {
        console.log('[ICON_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const runtime = "nodejs"