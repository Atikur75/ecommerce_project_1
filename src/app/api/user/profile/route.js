import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import {headers} from "next/headers";

export async function GET(req, res) {

    try{

        const headerList = headers();
        const user_id = parseInt(headerList.get("id"));
        const prisma = new PrismaClient();

        const result = await prisma.customer_profiles.findUnique({
            where : {
                user_id : user_id
            }
        });

        return NextResponse.json({status : "success", data: result})
    }catch (e) {
        return NextResponse.json({status : "Fail", data: e})
    }

}

export async function POST(req, res) {

    try{

        const headerList = headers();
        const user_id = parseInt(headerList.get("id"));
        const reqBody = await req.json();
        const prisma = new PrismaClient();

        const result = await prisma.customer_profiles.upsert({
            where : {
                user_id : user_id
            },
            update : reqBody,
            create : {
                ...reqBody,
                user_id : user_id
            }
        })

        return NextResponse.json({status : "success", data: result})
    }catch (e) {
        return NextResponse.json({status : "Fail", data: e})
    }

}

