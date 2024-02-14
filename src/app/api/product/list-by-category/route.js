import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const category_id = parseInt(searchParams.get("category_id"));
        const prisma = new PrismaClient();

        const result = await prisma.products.findMany({
            where : {
                category_id : category_id
            },
            include: {
                categories : {
                    select : {
                        categoryName : true,
                        categoryImg : true
                    }
                }
            }
        });

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}