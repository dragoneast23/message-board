---
name: "github-workers-project"
description: "创建基于Cloudflare Workers + D1数据库的Web项目并部署到GitHub和Cloudflare。包含API开发、前端页面、管理员功能、头像生成等完整功能。"
---

# GitHub上的Cloudflare Workers项目

## 功能概述

该技能用于创建完整的Cloudflare Workers项目，包含：
- 前端页面（HTML + Tailwind CSS）
- RESTful API（留言增删改查）
- D1数据库操作
- 管理员认证系统
- 分页功能
- 头像生成（DiceBear API）

## 项目结构

```
项目目录/
├── src/
│   └── index.js          # Worker入口文件（API + 前端页面）
├── schema.sql            # D1数据库初始化脚本
├── wrangler.toml         # Cloudflare Workers配置
├── package.json          # 项目配置
├── .gitignore            # Git忽略配置
└── README.md             # 使用说明
```

## 核心文件说明

### 1. wrangler.toml

```toml
name = "message-board"
main = "src/index.js"
compatibility_date = "2024-09-01"

[[d1_databases]]
binding = "DB"
database_name = "message-board-db"
database_id = "<你的数据库ID>"
```

### 2. schema.sql

```sql
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);
```

### 3. src/index.js

包含以下核心功能：
- **md5函数**: 纯JS实现的MD5哈希算法
- **getAvatarUrl**: 生成DiceBear头像URL
- **verifyAdmin**: 验证管理员身份
- **hmacSign**: HMAC签名生成
- **generateToken**: 生成安全会话令牌
- **API路由**: /api/messages, /api/admin/*
- **前端页面**: 完整的留言板UI

## API接口

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | /api/messages?page=1&limit=10 | 获取留言列表（分页） |
| POST | /api/messages | 提交新留言 |
| DELETE | /api/messages/:id | 删除留言（管理员） |
| POST | /api/messages/:id/replies | 回复留言（管理员） |
| POST | /api/admin/login | 管理员登录 |
| POST | /api/admin/logout | 管理员退出 |
| GET | /api/admin/status | 检查管理员状态 |

## 部署步骤

### 步骤1：创建D1数据库

```bash
wrangler login
wrangler d1 create message-board-db --update-config
```

### 步骤2：初始化数据库表

```bash
wrangler d1 execute message-board-db --remote --file schema.sql
```

### 步骤3：设置环境变量

```bash
wrangler secret put ADMIN_PASSWORD
wrangler secret put SESSION_SECRET
```

### 步骤4：部署到Cloudflare

```bash
wrangler deploy
```

### 步骤5：推送到GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin <GitHub仓库地址>
git push -u origin master
```

## 环境变量说明

| 变量名 | 说明 |
|--------|------|
| ADMIN_PASSWORD | 管理员密码 |
| SESSION_SECRET | 会话签名密钥（用于生成安全令牌） |

## 注意事项

1. **数据库ID**: 创建D1数据库后，需要更新wrangler.toml中的database_id
2. **头像源**: 使用DiceBear API，国内可正常访问
3. **安全**: SESSION_SECRET和ADMIN_PASSWORD必须通过wrangler secret设置，不要提交到GitHub
4. **部署**: GitHub集成部署时，需要手动在Cloudflare Dashboard中配置D1绑定和环境变量

## 常见问题

### Q1: Error 1031 - Invalid Workers Preview configuration
**解决方案**: 删除现有Worker，重新创建并手动部署代码

### Q2: 头像不显示
**原因**: Gravatar在国内无法访问
**解决方案**: 使用DiceBear API替代

### Q3: 数据库连接失败
**检查**: 
- wrangler.toml中的database_id是否正确
- D1绑定是否已配置
- 数据库表是否已创建

## 技术栈

- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **前端**: HTML + Tailwind CSS + 原生JavaScript
- **头像**: DiceBear API
- **认证**: HMAC签名会话令牌

## 使用场景

- 创建Web应用后端API
- 部署静态网站 + 后端逻辑
- 学习Cloudflare Workers开发
- 快速构建Serverless应用
