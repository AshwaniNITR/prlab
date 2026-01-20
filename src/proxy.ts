import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("refreshToken")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        // "/uploadConference/:path*",
        // "/uploadJournal/:path*",
        // "/uploadPatents/:path*",
    ],
};
