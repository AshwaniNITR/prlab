import { NextResponse } from "next/server";
import { SignJWT } from "jose";
//import dbConnect from "@/lib/dbconnect";
//import UserModel from "@/model/user";
//import bcrypt from "bcryptjs";
//import { use } from "react";

// const JWT_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

// const generateRefreshToken = async (id: any) => {
//     try {
//         const existingUser = await UserModel.findById(id)

//         if (!existingUser) {
//             throw new Error("User not found")
//         }

//         const refreshToken = await existingUser.generateRefreshToken()

//         existingUser.refreshToken = refreshToken

//         await existingUser.save({ validateBeforeSave: false })

//         return { refreshToken }
//     } catch (error) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Internal server error"
//             },
//             {
//                 status: 500
//             }
//         );
//     }
// }

export async function POST(req: Request) {
    try {
        //await dbConnect();
        const { email, password } = await req.json();

        // Admin login check for now using environment variables
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET || "default-secret");
            const token = await new SignJWT({ email, role: "admin" })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("1d")
                .sign(secret);

            const response = NextResponse.json(
                {
                    success: true,
                    message: "Login successful"
                },
                {
                    status: 200
                }
            );

            response.cookies.set("refreshToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
            });

            return response;
        }

        // const user = await UserModel.findOne({ email });
        // if (!user) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Invalid credentials"
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }

        // const isMatch = (password===user.password? true:false);
        // if (!isMatch) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             message: "Invalid credentials"
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }

        // const tokenResult = await generateRefreshToken(user._id);

        // if (tokenResult instanceof NextResponse) {
        //     return tokenResult;
        // }

        // const { refreshToken } = tokenResult;

        // const response = NextResponse.json(
        //     {
        //         success: true,
        //         message: "Login successful"
        //     },
        //     {
        //         status: 200
        //     }
        // );

        // response.cookies.set("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure:true,
        //     maxAge: 60 * 60 * 24,//
        //     path: "/",
        // });

        // return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        );
    }
}