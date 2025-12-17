import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.REFRESH_TOKEN_SECRET || "";

const generateRefreshToken = async (id: any) => {
    try {
        const existingUser = await UserModel.findById(id)

        if (!existingUser) {
            throw new Error("User not found")
        }

        const refreshToken = await existingUser.generateRefreshToken()

        existingUser.refreshToken = refreshToken

        await existingUser.save({ validateBeforeSave: false })

        return { refreshToken }
    } catch (error) {
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

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials"
                },
                {
                    status: 401
                }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials"
                },
                {
                    status: 401
                }
            );
        }

        const tokenResult = await generateRefreshToken(user._id);

        if (tokenResult instanceof NextResponse) {
            return tokenResult;
        }

        const { refreshToken } = tokenResult;

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful"
            },
            {
                status: 200
            }
        );

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure:true,
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;
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