import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Product Id required", { status: 400 });
        }

        const product= await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                sizes: true,
                colors: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};


export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { 
            name,
            price,
            categoryId,
            colors,
            sizes,
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

        if (!params.productId) {
            return new NextResponse("Product Id required", { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
               name,
               price,
               categoryId,
               images: {
                deleteMany: {}
               },
               sizes: {
                set: sizes.map((id: string) => ({ id }))
               },
               colors: {
                set: colors.map((id: string) => ({ id }))
               },
               isFeatured,
               isArchived,
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string; colorId?: string | null }) => ({
                                url: image.url,
                                colorId: image.colorId || null,
                            })),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();
       


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product Id required", { status: 400 });
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

        const product= await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const runtime = "nodejs"