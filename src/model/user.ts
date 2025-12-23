import mongoose, { Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export interface User extends Document {
    email: string
    password: string
    refreshToken?: string

    comparePassword(password: string): Promise<boolean>
    generateAccessToken(): string
    generateRefreshToken(): string
}

const UserSchema = new Schema<User>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
        },
    }
)

UserSchema.pre<User>("save", async function () {
    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY!
        } as jwt.SignOptions
    )
}


UserSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY!
        } as jwt.SignOptions
    )
}

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel
