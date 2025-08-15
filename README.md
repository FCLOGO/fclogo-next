# FCLOGO.TOP - 足球俱乐部矢量徽标数据库 (重构版)

本项目是 FCLOGO.TOP 网站的完整重构版本。新版本采用了一套现代化的、高性能的、可扩展的全栈技术栈，旨在解决原 Gatsby 静态站点在内容规模扩大后遇到的性能瓶颈和维护难题。

## ✨ 项目亮点

*   **高性能架构**: 采用 Next.js App Router 和增量静态再生 (ISR)，实现页面的按需生成和静态缓存，兼具静态网站的速度和动态网站的灵活性。
*   **内容驱动**: 所有数据均由强大的 Headless CMS **Sanity.io** 驱动，实现了内容与代码的完全分离。
*   **自动化搜索**: 集成 **Supabase (PostgreSQL)** 提供高性能的全文搜索服务，并通过 **Cloudflare Worker** 实现了与 Sanity 的数据自动同步。

## 🚀 技术栈 (Tech Stack)

| 类别               | 服务/技术                                                          | 版本              | 用途                                                                |
| :----------------- | :----------------------------------------------------------------- | :---------------- | :------------------------------------------------------------------ |
| **框架**           | [Next.js](https://nextjs.org/)                                     | v15+ (App Router) | 应用框架，负责前端渲染和服务端逻辑。                                |
| **样式**           | [Tailwind CSS](https://tailwindcss.com/)                           | v4+               | 原子化 CSS 框架。                                                   |
| **UI 组件库**      | [daisyUI](https://daisyui.com/)                                    | v5+               | 基于 Tailwind CSS 的 UI 组件库。                                    |
| **内容管理 (CMS)** | [Sanity.io](https://www.sanity.io/)                                | v3+               | 作为 Headless CMS，存储所有核心内容数据。                           |
| **图片存储**       | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) | -                 | 对象存储，用于存放所有徽标的 PNG/SVG 原文件。                       |
| **部署平台**       | [Cloudflare Pages](https://www.cloudflare.com/developer-platform/products/pages/)                                | -                 | 托管和部署 Next.js 前端应用。                                       |
| **搜索服务**       | [Supabase (PostgreSQL)](https://supabase.com/)                     | -                 | 提供基于 `pg_trgm` 的全文搜索索引和 RPC 函数。                      |
| **下载计数**       | [Supabase (PostgreSQL)](https://supabase.com/)                     | -                 | 提供原子性的下载计数功能。                                          |
| **数据同步**       | [Cloudflare Workers](https://workers.cloudflare.com/)              | -                 | 作为独立的 Webhook 接收器，实现 Sanity 到 Supabase 的数据自动同步。 |

## 📬 提交徽标 (Submit Logos)

可以通过以下方式向我们提交徽标：

[Discuss FCLOGO on GitHub](https://github.com/orgs/FCLOGO/discussions/categories/submit-logos)

## 💬 社区 (Community)

如需帮助、提交错误报告或进行其他任何适合被搜索的讨论：

[Discuss FCLOGO on GitHub](https://github.com/orgs/FCLOGO/discussions)

也可以加入我们的 Discord 服务器：

[Join the Discord Server](https://discord.gg/gVcbysaEWD)