# All-in-One Server

一个综合性的服务器项目，目前包含爬虫服务和云控工作流服务。

## 项目结构

- `cloudsphere`: 云控服务，支持用户管理和工作流等
- `crawler`: 爬虫服务，提供 API 接口创建爬虫任务
- `packages/shared`: 共享工具包

## 技术栈

- Node.js + TypeScript
- Next.js (前后端框架)
- Playwright (无头浏览器)
- Prisma (数据库 ORM)
- NextAuth.js (认证)

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 数据库初始化 (cloudsphere)
# 生成 Prisma 客户端
npm run prisma:generate --workspace=cloudsphere

# 推送数据库更改
npm run prisma:push --workspace=cloudsphere

# 执行数据库迁移
npm run prisma:migrate --workspace=cloudsphere

# 部署数据库迁移
npm run prisma:deploy --workspace=cloudsphere
```

## 服务说明

### 爬虫服务 (crawler)

- 端口：3001
- 特点：
  - 使用 Playwright 进行网页爬取
  - API Key 认证
  - RESTful API 接口

### 云控服务 (cloudsphere)

- 端口：3000
- 特点：
  - 完整的用户认证系统
  - 可视化工作流编排
  - 定时任务支持
  - 支持调用爬虫服务
