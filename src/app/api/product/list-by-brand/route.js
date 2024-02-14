import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const brand_id = parseInt(searchParams.get("brand_id"));
        const prisma = new PrismaClient();

        const result = await prisma.products.findMany({
            where : {
                brand_id : brand_id
            },
            include:{
                brands : {
                    select : {
                        brandName : true,
                        brandImg : true,
                    }
                }
            }
        });

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}