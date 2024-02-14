import {jwtVerify, SignJWT} from "jose";
import {NextResponse} from "next/server";

export async function CreateToken(email,id) {

    const key = new TextEncoder().encode(process.env.JWT_SECRET);
    const Payload = {email: email, id: id};

    console.log(Payload["email"])

    let token = await new SignJWT(Payload)
        .setProtectedHeader({alg : "HS256"})
        .setIssuedAt()
        .setIssuer(process.env.JWT_ISSUER)
        .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
        .sign(key)

    return token;
}

export async function VerifyToken(token) {

    const key = new TextEncoder().encode(process.env.JWT_SECRET);
    const decoded = await jwtVerify(token,key);

    return decoded["payload"];

}