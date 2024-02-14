import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const details_id = parseInt(searchParams.get("id"));
        const prisma = new PrismaClient();

        const result = await prisma.products.findUnique({
            where : {
                id : details_id
            },
            include : {
                product_details : true
            }
        });

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}