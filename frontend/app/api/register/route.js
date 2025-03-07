import { NextResponse } from "next/server";
import Connection from "../../dbconfig/dbconfig";
import User from "../../../models/page";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await Connection(); // Ensure database connection

    const data = await User.find();

    if (!data || data.length === 0) {
      console.log("No users found");
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Users fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching the users." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await Connection(); // Establish DB connection

    const { firstname, lastname, email, password } = await request.json();

    // Validate input fields
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error registering user", error: error.message },
      { status: 500 }
    );
  }
}
