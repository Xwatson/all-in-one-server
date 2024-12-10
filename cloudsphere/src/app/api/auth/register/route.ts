import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ ok: false, error: '用户已存在' }, {
        status: 400,
      })
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    })

    return NextResponse.json({ ok: true, message: '注册成功' }, {
      status: 201,
    })
  } catch (error) {
    console.error('Error in register route:', error)
    return NextResponse.json({ ok: false, error: '内部服务器错误' }, {
      status: 500,
    })
  }
}
