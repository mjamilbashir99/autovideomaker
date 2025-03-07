import User from "../../../models/page";
import Connection from "../../dbconfig/dbconfig";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    await Connection();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "❌ ID is required" },
        { status: 400 }
      );
    }

    // ✅ Find and delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "❌ User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "✅ User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json(
      { message: "❌ Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // ✅ Extract query parameters correctly
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "❌ ID is required" },
        { status: 400 }
      );
    }

    // ✅ Ensure database connection
    await Connection();

    // ✅ Find user by ID
    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json(
        { message: "❌ User not found" },
        { status: 404 }
      );
    }

    // ✅ Return the user data if found
    return NextResponse.json(
      { message: "✅ User fetched successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { message: "❌ Server error", error: error.message },
      { status: 500 }
    );
  }
}
