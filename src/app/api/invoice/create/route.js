import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req, res) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const cus_email = headerList.get("email");
    const prisma = new PrismaClient();

    // =============== Step 1: Calculate Total Payable & Vat ==========================

    const CartProducts = await prisma.product_carts.findMany({
        where : {
            user_id : user_id
        },
        include : {
            products : true
        }
    });

    let TotalAmount = 0;
    CartProducts.forEach((element)=>{
        
        let price;
        if(element["products"]["discount"]){
            price = element["products"]["discount_price"]
        }else{
            price = element["products"]["price"]
        }
        TotalAmount = element["qty"]*price

    });

    let vat = TotalAmount*0.05 // 5% vat
    let payableAmount = TotalAmount + vat;
   

    return NextResponse.json({ status: "success", data: CartProducts });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}