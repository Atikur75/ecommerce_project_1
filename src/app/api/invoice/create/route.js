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
      where: {
        user_id: user_id,
      },
      include: {
        products: true,
      },
    });

    let TotalAmount = 0;
    CartProducts.forEach((element) => {
      let price;
      if (element["products"]["discount"]) {
        price = element["products"]["discount_price"];
      } else {
        price = element["products"]["price"];
      }
      TotalAmount = element["qty"] * price;
    });

    let vat = TotalAmount * 0.05; // 5% vat
    let payableAmount = TotalAmount + vat;

    // =============== Step 2: Prepare Customer Details & Shipping Details ==========================

    const CustomerProfile = await prisma.customer_profiles.findUnique({
      where: {
        user_id: user_id,
      },
    });

    const cus_details = `Name: ${CustomerProfile["cus_name"]}, Email: ${cus_email}, Address: ${CustomerProfile["cus_add"]}, Phone: ${CustomerProfile["cus_phone"]}`;
    const ship_details = `Name: ${CustomerProfile["ship_name"]}, City: ${CustomerProfile["ship_city"]}, Address: ${CustomerProfile["ship_add"]}, Phone: ${CustomerProfile["ship_phone"]}`;

    // =============== Step 3: Transaction & Other's ID ==========================

    const tran_id = Math.floor(10000000 + Math.random() * 90000000).toString();
    const val_id = "0";
    const delivery_status = "Pending";
    const payment_status = "Pending";

    // =============== Step 4: Create Invoice ==========================

    const CreateInvoice = await prisma.invoices.create({
      data: {
        total: TotalAmount,
        vat: vat,
        payable: payableAmount,
        cus_details: cus_details,
        ship_details: ship_details,
        tran_id: tran_id,
        val_id: val_id,
        delivery_status: delivery_status,
        payment_status: payment_status,
        user_id: user_id,
      },
    });

    // =============== Step 5: Create Invoice Product ==========================

    const invoice_id = CreateInvoice["id"];

    for (const element of CartProducts) {
      const CreateInvoiceProduct = await prisma.invoice_products.create({
        data: {
          invoice_id: invoice_id,
          product_id: element["product_id"],
          user_id: user_id,
          qty: element["qty"],
          sale_price: element["products"]["discount_price"]
            ? element["products"]["discount_price"]
            : element["products"]["price"],
          color: element["color"],
          size: element["size"],
        },
      });
    }

    // =============== Step 6: Remove Carts ==========================

    await prisma.product_carts.deleteMany({
      where: {
        user_id : user_id
      }
    });

    // =============== Step 7: Prepare SSL Payment ==========================

    const PaymentSettings = await prisma.sslcommerz_accounts.findFirst();

    const form = new FormData();

    // Store Related Info
    form.append("store_id",PaymentSettings["store_id"])
    form.append("store_passwd",PaymentSettings["store_passwd"])
    form.append("total_amount",payableAmount.toString())
    form.append("currency",PaymentSettings["currency"])
    form.append("tran_id",tran_id)

    // After Completing Payment Scenario Case
    form.append("success_url",`${PaymentSettings["success_url"]}?tran_id=${tran_id}`)
    form.append("fail_url",`${PaymentSettings["fail_url"]}?tran_id=${tran_id}`)
    form.append("cancel_url",`${PaymentSettings["cancel_url"]}?tran_id=${tran_id}`)
    form.append("ipn_url",`${PaymentSettings["ipn_url"]}?tran_id=${tran_id}`)

    // Customer Related Info
    form.append("cus_name",CustomerProfile["cus_name"])
    form.append("cus_email",cus_email)
    form.append("cus_add1",CustomerProfile["cus_add"])
    form.append("cus_add2",CustomerProfile["cus_add"])
    form.append("cus_city",CustomerProfile["cus_city"])
    form.append("cus_state",CustomerProfile["cus_state"])
    form.append("cus_postcode",CustomerProfile["cus_postcode"])
    form.append("cus_country",CustomerProfile["cus_country"])
    form.append("cus_phone",CustomerProfile["cus_phone"])
    form.append("cus_fax",CustomerProfile["cus_fax"])

    // Shipping Related Info
    form.append("shipping_method","YES");
    form.append("ship_name",CustomerProfile["ship_name"])
    form.append("ship_add1",CustomerProfile["ship_add"])
    form.append("ship_add2",CustomerProfile["ship_add"])
    form.append("ship_city",CustomerProfile["ship_city"])
    form.append("ship_state",CustomerProfile["ship_state"])
    form.append("ship_country",CustomerProfile["ship_country"])
    form.append("ship_postcode",CustomerProfile["ship_postcode"])

    // Product Related Info
    form.append("product_name","According to invoice");
    form.append("product_category","According to invoice");
    form.append("product_profile","According to invoice");
    form.append("product_amount","According to invoice");

    const SSLRes = await fetch(PaymentSettings["init_url"],{
      method: 'POST',
      body: form
    })

    const SSLResJSON = await SSLRes.json();

    return NextResponse.json({ status: "success", data: SSLResJSON });
  } catch (e) {
    return NextResponse.json({ status: "Fail", data: e });
  }
}
