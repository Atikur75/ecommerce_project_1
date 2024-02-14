import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import { headers } from "next/headers";

export async function POST(req,res) {

    try{

        const headerList = headers();
        const user_id = parseInt(headerList.get("id"));
        const reqBody = await req.json();
        const prisma = new PrismaClient();

        const result = await prisma.product_wishes.create({
            data : {
                product_id : reqBody["product_id"],
                user_id : user_id
            }
        });        

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}

export async function GET(req,res) {

    try{

        const headerList = headers();
        const user_id = parseInt(headerList.get("id"));
        const prisma = new PrismaClient();

        const result = await prisma.product_wishes.findMany({
            where : {
                user_id : user_id
            },
            include : {
                products : true,
            }
        });        

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}

export async function DELETE(req,res) {

    try{

        const headerList = headers();
        const user_id = parseInt(headerList.get("id"));
        const reqBody = await req.json();
        const prisma = new PrismaClient();

        const result = await prisma.product_wishes.deleteMany({
            where : {
                AND : [
                    {
                        product_id : reqBody["product_id"]
                    },
                    {
                        user_id : user_id
                    }
                ]
            },
        });        

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}