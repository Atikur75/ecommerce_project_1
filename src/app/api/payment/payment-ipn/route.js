import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("tran_id");
    const reqBody = await req.json();
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
        payment_status: reqBody["status"],
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}