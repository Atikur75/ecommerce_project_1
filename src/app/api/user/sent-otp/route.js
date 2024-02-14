import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";
import {SendMail} from "@/utility/EmailUtility";

export async function GET(req,res) {

    try{

        const {searchParams} = new URL(req.url);
        const email = searchParams.get("email");
        const prisma = new PrismaClient();

        let code = (Math.floor(100000 + Math.random() * 900000)).toString();
        let EmailText = `Your OTP Code is : ${code}`;
        let EmailSubject = "Next Ecommerce Verification Code";
        await SendMail(email,EmailText,EmailSubject);

        const result = await prisma.users.upsert({
            where : {
                email : email
            },
            update : {
                otp : code
            },
            create : {
                email : email,
                otp : code
            }
        })

        return NextResponse.json({status : "success", data: result})

    }catch (e) {
        return NextResponse.json({status: "Fail", data: e})
    }

}