import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json(
        {
            success: true,
            message: "Logged out successfully"
        },
        {
            status: 200
        }
    );

    response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
