import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const keyword = searchParams.get("keyword");
        const prisma = new PrismaClient();

        const result = await prisma.products.findMany({
            where : {
                title : {
                    contains : keyword
                }
            }
        });

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}