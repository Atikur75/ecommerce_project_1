import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req, res) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const reqBody = await req.json();
    reqBody.user_id = user_id;
    const prisma = new PrismaClient();

    const result = await prisma.product_carts.create({
      data: reqBody,
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}

export async function PUT(req, res) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const reqBody = await req.json();
    const prisma = new PrismaClient();

    const result = await prisma.product_carts.updateMany({
      where: {
        AND: [{ user_id: user_id }, { id: reqBody["id"] }],
      },
      data: {
        color: reqBody["color"],
        size: reqBody["size"],
        qty: reqBody["qty"],
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}

export async function GET(req, res) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const prisma = new PrismaClient();

    const result = await prisma.product_carts.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}

export async function DELETE(req, res) {
  try {
    const headerList = headers();
    const user_id = parseInt(headerList.get("id"));
    const reqBody = await req.json();
    const cart_id = reqBody["id"];
    const prisma = new PrismaClient();

    const result = await prisma.product_carts.deleteMany({
      where: {
        AND: [
          {
            user_id: user_id,
          },
          {
            id : cart_id
          }
        ],
      },
    });

    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}
