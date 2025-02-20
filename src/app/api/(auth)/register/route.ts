import { NextRequest, NextResponse } from "next/server";
import { connectDB ,db} from "@/configuration/db";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";




export async function POST(req: NextRequest) {
    try {
        await connectDB();
        
        const bodyData = await req.json();

        await Promise.all([
            body("name").trim().isLength({ min: 1 }).run({ body: bodyData }),
            body("email").trim().isLength({ min: 1 }).isEmail().withMessage("Invalid email").run({ body: bodyData }),
            body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run({ body: bodyData }),
        ]);

        const errors = validationResult({ body: bodyData });

        if (!errors.isEmpty()) {
            return NextResponse.json({ status: false, msg: "Validation failed", errors: errors.array() }, { status: 400 });
        }

        const { email, password, name } = bodyData;
        const passwordHash = await bcrypt.hash(password, 10);

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) {
            return NextResponse.json({ status: false, msg: "User already exists" }, { status: 400 });
        }

        const newUser = await db.collection("users").insertOne({ name, email, passwordHash });

        return NextResponse.json({ status: true, msg: "User registered successfully", userId: newUser.insertedId }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ status: false, msg: "Internal server error" }, { status: 500 });
    }
}
