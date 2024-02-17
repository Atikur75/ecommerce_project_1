import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req, res) {
  try {
    
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const reqBody = await req.json();
    const prisma = new PrismaClient();

    const result = await prisma.invoice_products.findMany({
        where : {
            AND : [
                {
                    user_id : user_id
                },
                {
                    invoice_id : reqBody["invoice_id"]
                }
            ]
        },
        include : {
            products : true
        }
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}