import { NextResponse } from "next/server";
import Connection from "../../dbconfig/dbconfig";
import User from "../../../models/page";
import crypto from "crypto";

export async function POST(request) {
  await Connection();
  const { email } = await request.json();
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Email does not exist" },
      { status: 400 }
    );
  }

  const restToken = crypto.rendomBytes(20).toString("hex");
  const resetPasswordExpiry = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
}
