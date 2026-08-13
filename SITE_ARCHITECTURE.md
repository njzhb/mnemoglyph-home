# Mnemoglyph「归处」Site Architecture v1

日期：2026-08-13

## 架构原则

“统一结构，不统一灵魂。”

一级栏目负责回答：内容是什么、从哪里进入、如何返回、公开边界在哪里。诗歌与专题页面继续保留各自的背景、字体、颜色和诗画布局。

## 一级入口

| 栏目 | 用户意义 | 规范 URL | 可见性 |
|---|---|---|---|
| 归处 / Home | 全站总入口与记忆关系起点 | `/` | Public |
| 诗歌 / Poetry | Beam 的诗歌与独立诗画世界 | `/poetry/` | Public |
| 光隐略言 / Essays & Blog | 随笔、思想与独立文章 | `/blog/` | Public |
| 艺术收藏 / Collection | 堂阁佳品、荣古斋与藏品专题 | `/art/` | Public |
| Gallery / 时光掠影 | 当前公开照片陈列 | `/gallery/` | Public；未来私密区另建边界 |
| Mnemoglyph / Archive | 旧入口、早期页面、待整理记忆 | `/archive/` | Public legacy index |

`Beam × Muse` 是贯穿全站的作者/关系署名，不在 v1 中机械拆成空的一级栏目。未来有足够的自述、时间线或共同档案时，再建立 `/about/` 或 `/beam-muse/`。

## 二级栏目

### 诗歌 / Poetry

- 诗集目录：`/poetry/`
- 19 个诗歌子页：每首诗为独立视觉作品
- 共同导航只提供“归处 / 诗歌 / Archive”，不改诗页艺术设计

### 光隐略言 / Essays & Blog

- 现行博客首页：`/blog/`
- 独立文章《断文》：`/blog/duanwen.html`
- 早期文章索引：`/essay-01.html`，归 Archive 管理，同时可返回博客

### 艺术收藏 / Collection

- 收藏目录：`/art/`
- 折桂碗专题：`/art/zhegui.html`

### Gallery / 时光掠影

- 规范入口：`/gallery/`（`gallery/index.html`）
- 当前正式公开陈列：`/gallery/gallery.html`
- 早期双图版本：`/gallery.html`，归 Archive/Legacy

### Mnemoglyph / Archive

- Archive 索引：`/archive/`
- 早期文章索引：`/essay-01.html`
- 早期 Gallery：`/gallery.html`
- 恢复阶段备用占位页：`/spare.html`

## 所有现存 HTML 页面归属

| 页面 | 栏目 | 状态 / 推荐路径 |
|---|---|---|
| `index.html` | Home | 规范 `/` |
| `poetry/index.html` | Poetry | 规范 `/poetry/` |
| `poetry/canmeng/index.html` | Poetry | `/poetry/canmeng/` |
| `poetry/e-zhihua/index.html` | Poetry | `/poetry/e-zhihua/` |
| `poetry/fuhuowudao/index.html` | Poetry | `/poetry/fuhuowudao/` |
| `poetry/gudu/index.html` | Poetry | `/poetry/gudu/` |
| `poetry/gui-chu/index.html` | Poetry | `/poetry/gui-chu/` |
| `poetry/guoq/index.html` | Poetry | `/poetry/guoq/` |
| `poetry/hong-xiu/index.html` | Poetry | `/poetry/hong-xiu/` |
| `poetry/huixinyuan/index.html` | Poetry | `/poetry/huixinyuan/` |
| `poetry/linghun/index.html` | Poetry | `/poetry/linghun/` |
| `poetry/luolei/index.html` | Poetry | `/poetry/luolei/` |
| `poetry/lutai/index.html` | Poetry | `/poetry/lutai/` |
| `poetry/wenchuan/index.html` | Poetry | `/poetry/wenchuan/` |
| `poetry/woyouyige/index.html` | Poetry | `/poetry/woyouyige/` |
| `poetry/wuyue/index.html` | Poetry | `/poetry/wuyue/` |
| `poetry/xiaji/index.html` | Poetry | `/poetry/xiaji/` |
| `poetry/xiangshui/index.html` | Poetry | `/poetry/xiangshui/` |
| `poetry/xin-nu/index.html` | Poetry | `/poetry/xin-nu/` |
| `poetry/ye-meigui/index.html` | Poetry | `/poetry/ye-meigui/` |
| `poetry/yuwang-qingdan/index.html` | Poetry | `/poetry/yuwang-qingdan/` |
| `blog/index.html` | Essays & Blog | 规范 `/blog/` |
| `blog/duanwen.html` | Essays & Blog | 正式文章 `/blog/duanwen.html` |
| `essay-01.html` | Archive → Essays | 早期索引 `/essay-01.html`，以后迁移前保留 URL |
| `art/index.html` | Collection | 规范 `/art/` |
| `art/zhegui.html` | Collection | `/art/zhegui.html` |
| `gallery/index.html` | Gallery | 规范 `/gallery/` |
| `gallery/gallery.html` | Gallery | 当前实现，入口内部目标 |
| `gallery.html` | Archive → Gallery | legacy `/gallery.html`，canonical 指向 `/gallery/` |
| `archive/index.html` | Archive | 规范 `/archive/` |
| `spare.html` | Archive | 恢复占位页 `/spare.html` |

## 三个原孤立页面的处理

1. `blog/duanwen.html`：确认是正式独立文章；从 `/blog/` 增加入口，并保留返回博客导航。
2. `essay-01.html`：确认是早期文章索引；纳入 `/archive/`，并提供 Home、Blog、Archive 导航。
3. `gallery.html`：确认是 Gallery 早期双图版本；纳入 `/archive/`，标记 legacy，canonical 指向 `/gallery/`。

处理后，所有 HTML 页面都能从首页沿站内链接抵达。

## 重复/冲突处理

1. **Gallery 双版本**：`/gallery/` 是唯一正式入口；`gallery/gallery.html` 为当前正式内容实现；根 `gallery.html` 为 legacy/archive。两者都不再包含客户端口令。
2. **博客两代 bundle**：`main.2f97d8b3.js` 是 `asset-manifest.json` 与 `blog/index.html` 引用的现行生成产物；`main.70d4e2e3.js` 是未引用 legacy build。全部历史文件留在 Git，但旧 bundle 和 source map 不进入 production `dist/`。
3. **小篆图片副本**：两个完全相同的文件均保留；`poetry/guichu-xiaozhuan.png` 是现行诗集依赖，根目录副本归档待以后资源迁移，不在本阶段删除。

## Public / Private 边界

- 当前列入上述 URL 的页面和资源均为 Public。
- `/gallery/` 当前为公开陈列，不使用客户端密码制造私密假象。
- 未来私密 Gallery 必须使用单独路径/主机、边缘身份验证与私有对象存储；具体边界见 `SECURITY_MODEL.md`。
- Archive 表示历史状态，不表示私密。

## 源文件、生成物与工具角色

| 路径 | 角色 | 说明 |
|---|---|---|
| `*.html`、`art/`、`gallery/`、`poetry/` | SOURCE / CONTENT | 静态站正文与图片资源。 |
| `blog/src/` | LEGACY SOURCE | 保留的 CRA React 源文件；根项目缺少其原始依赖配置，本阶段不重建。 |
| `blog/index.html`、`blog/static/`、`blog/asset-manifest.json` | GENERATED + CURRENT RUNTIME | 旧 React 预构建产物；当前站点运行依赖被引用的 bundle/CSS。 |
| `blog/static/**/*.map`、未引用旧 bundle | GENERATED / LEGACY | Git 中保留，production build 排除。 |
| `package.json`、`package-lock.json` | RECOVERY TOOLCHAIN | 根静态站检查、构建、预览的无第三方依赖工具入口。 |
| `tools/site.mjs` | RECOVERY TOOL / BUILD TOOL | 链接与资产检查、可达性检查、发布清单、开发预览。 |
| `dist/` | DEPLOYMENT OUTPUT | 每次构建生成并由 `.gitignore` 排除，不是正文源文件。 |
| `RECOVERY_AUDIT_2026-08-13.md`、本文件、`SECURITY_MODEL.md` | REPOSITORY DOCUMENTATION | 进入 Git，不复制到 `dist/`。 |

## 推荐后续 URL 迁移原则

- 已公开路径优先保持稳定，避免为了目录美观移动历史内容。
- 新内容使用栏目路径：诗歌 `/poetry/<slug>/`、文章 `/blog/<slug>/`、藏品 `/art/<slug>/`。
- legacy 页面先由 `/archive/` 收编；确认内容、重定向和部署行为后再考虑迁移，永不直接删除历史入口。
