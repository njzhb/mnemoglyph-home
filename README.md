# Mnemoglyph「归处」

本项目是一个以静态 HTML、CSS、JavaScript 和图片为主体的网站。`blog/` 中保留了既有的 React 预构建产物及源文件；恢复阶段不升级或重建该旧技术栈。

## 本地开发

需要 Node.js 22 或更高版本。项目没有第三方 npm 依赖。

```sh
npm install
npm run check
npm run dev
```

本地预览默认位于 `http://127.0.0.1:4173/`。

## Production build

```sh
npm run build
```

构建结果写入 `dist/`。构建过程会检查所有本地 HTML 引用，遇到缺失的页面、图片、脚本或样式时失败。

## Cloudflare Pages

建议使用以下配置：

- Framework preset：None
- Production branch：`main`
- Root directory：仓库根目录（留空）
- Build command：`npm run build`
- Build output directory：`dist`
- Environment variables：当前站点不需要自定义变量

在确认 Cloudflare 控制台现有项目配置前，不要新增 Wrangler 配置文件或新建同名 Pages 项目，以免覆盖已有生产设置。
