import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("tran_id");
    const prisma = new PrismaClient();

    const result = await prisma.invoices.updateMany({
      where: {
        AND: [
          {
            tran_id: tran_id,
          },
        ],
      },
      data: {
        payment_status: "cancel",
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}

// https://sandbox.sslcommerz.com/gwprocess/v4/bankgw/indexhtmlOTP.php?mamount=0.00&ssl_id=240217907550aaBwZXqbu4xBiD&Q=REDIRECT&SESSIONKEY=AEBDAFE0EA89362CA700DEFCDA37A02A&tran_type=success&cardname=nagad
