import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const review_id = parseInt(searchParams.get("product_id"));
        const prisma = new PrismaClient();

        const result = await prisma.product_reviews.findMany({
            where:{
                product_id : review_id
            },
            include:{
                customer_profiles : {
                    select : {
                        cus_name : true,
                    }
                },
                products : {
                    select : {
                        title : true
                    }
                }
            }
        });

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}