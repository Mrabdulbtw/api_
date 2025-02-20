import { NextRequest, NextResponse } from "next/server";
import { connectDB,db } from "@/configuration/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { body, validationResult } from "express-validator";

export async function POST(req: NextRequest) {
    try {
        
        await connectDB();
        const bodyData = await req.json();

        await Promise.all([
            body("email").trim().isEmail().withMessage("Invalid email").run({ body: bodyData }),
            body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run({ body: bodyData }),
        ]);

        const errors = validationResult({ body: bodyData });

        if (!errors.isEmpty()) {
            return NextResponse.json({ status: false, msg: "Validation failed", errors: errors.array() }, { status: 400 });
        }

        const { email, password } = bodyData;
        const existingUser = await db.collection("users").findOne({ email });

        if (!existingUser) {
            return NextResponse.json({ status: false, msg: "Invalid credentials" }, { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
        
        if (!isPasswordValid) {
            return NextResponse.json({ status: false, msg: "Invalid credentials" }, { status: 400 });
        }

        const token = jwt.sign({ userId: existingUser._id }, "jwt", {
            expiresIn: "1h",
        });

        return NextResponse.json({ status: true, msg: "Login successful", token }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ status: false, msg: "Internal server error" }, { status: 500 });
    }
}
