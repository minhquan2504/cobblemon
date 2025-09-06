import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tất cả các trường đều bắt buộc" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "viewer"
      }
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTER",
        details: `User registered with email: ${email}`
      }
    })

    return NextResponse.json(
      { message: "Đăng ký thành công", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng ký" },
      { status: 500 }
    )
  }
}
