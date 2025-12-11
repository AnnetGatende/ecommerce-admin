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

        const { 
            name,
            price,
            categoryId,
            sizes,
            colors,
            images,
            isFeatured,
            isArchived
         } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if(!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if(!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        if(!colors || !Array.isArray(colors) || colors.length === 0) {
            return new NextResponse("Colors are required", { status: 400 });
        }

        if(!sizes || !Array.isArray(sizes) || sizes.length === 0) {
            return new NextResponse("Sizes are required", { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                categoryId,
                storeId: params.storeId,
                sizes: {
                    connect: sizes.map((id: string) => ({ id }))
                },
                colors: {
                    connect: colors.map((id: string) => ({ id }))
                },
                images: {
                    createMany: {
                        data: images.map((image: { url: string; colorId?: string | null }) => ({
                            url: image.url,
                            colorId: image.colorId || null,
                        }))
                    },
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
       console.log('[PRODUCTS_POST]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};

// getting all the billboards

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){ 
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("Store ID is required is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colors: colorId ? {
                    some: {
                        id: colorId
                    }
                } : undefined,
                sizes: sizeId ? {
                    some: {
                        id: sizeId
                    }
                } : undefined,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                colors: true,
                sizes: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch (error) {
       console.log('[PRODUCTS_GET]', error);
       return new NextResponse("Internal error", { status: 500 });
    }   
};

export const runtime = "nodejs"