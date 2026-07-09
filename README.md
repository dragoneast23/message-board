# 留言板应用

基于 Cloudflare Workers + D1 数据库的留言板应用

## 功能特性

- ✅ 用户提交留言（姓名、邮箱、内容）
- ✅ 留言列表展示（分页、头像、时间）
- ✅ 管理员回复留言
- ✅ 管理员删除留言
- ✅ 安全的管理员认证

## 技术栈

- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **前端**: HTML + Tailwind CSS + 原生 JavaScript

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 创建 D1 数据库

```bash
wrangler d1 create message-board-db
```

复制返回的 `database_id`，粘贴到 `wrangler.toml` 文件中。

### 3. 初始化数据库表

```bash
wrangler d1 execute message-board-db --file schema.sql
```

### 4. 设置环境变量

```bash
wrangler secret put ADMIN_PASSWORD
wrangler secret put SESSION_SECRET
```

### 5. 本地开发

```bash
npm run dev
```

### 6. 部署到 Cloudflare

```bash
npm run deploy
```

## 项目结构

```
.
├── src/
│   └── index.js          # Worker 入口文件（包含 API 和前端页面）
├── schema.sql            # 数据库初始化脚本
├── wrangler.toml         # Cloudflare Workers 配置
├── package.json          # 项目配置
└── .gitignore            # Git 忽略文件
```

## API 接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/messages?page=1&limit=10` | 获取留言列表（分页） |
| POST | `/api/messages` | 提交新留言 |
| DELETE | `/api/messages/:id` | 删除留言（管理员） |
| POST | `/api/messages/:id/replies` | 回复留言（管理员） |
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/admin/logout` | 管理员退出 |
| GET | `/api/admin/status` | 检查管理员状态 |

## 使用说明

1. **发表留言**: 填写姓名、邮箱和留言内容，点击提交
2. **查看留言**: 页面会自动显示所有留言，按时间倒序排列
3. **管理员登录**: 点击右上角「管理员登录」按钮，输入管理员密码
4. **回复留言**: 登录后，每条留言会显示「回复」按钮
5. **删除留言**: 登录后，每条留言会显示「删除」按钮