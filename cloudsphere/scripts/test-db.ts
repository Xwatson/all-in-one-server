import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log('Successfully connected to database')

    // 测试查询
    const userCount = await prisma.user.count()
    console.log(`Current user count: ${userCount}`)
  } catch (error) {
    console.error('Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
