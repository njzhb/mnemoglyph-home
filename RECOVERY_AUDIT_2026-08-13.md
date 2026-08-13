# Mnemoglyph「归处」Recovery Baseline v1 审计

审计日期：2026-08-13
项目路径：`C:\Users\pusho\OneDrive\Documents\ChatGPT\归处网站`

本报告记录恢复现场，目标是先完整封存可用内容，再为后续统一网站结构提供依据。本次审计不删除历史、诗歌、图片或文章，也不合并存在差异的旧页面。

## 1. Git 基线

- 原始基线分支：`main`
- 原始基线提交：`37b407e375b9839a3b31733427fe077accd374ca`
- `origin/main`：`37b407e375b9839a3b31733427fe077accd374ca`
- 原始仓库：`https://github.com/njzhb/mnemoglyph-home.git`
- 恢复分支：`recovery/2026-08-13-baseline`
- 分支创建方式：从上述共同提交创建，并完整保留 dirty working tree
- 审计时本地已提交历史与 `origin/main` 一致；恢复内容尚未进入 `main`

## 2. 当前恢复文件清单

### 修改的既有文件

1. `blog/duanwen.html`
2. `blog/index.html`
3. `blog/manifest.json`
4. `essay-01.html`
5. `gallery.html`
6. `poetry/linghun/index.html`
7. `poetry/yuwang-qingdan/index.html`

### 新增文件

1. `.gitignore`
2. `README.md`
3. `gallery/index.html`
4. `package-lock.json`
5. `package.json`
6. `spare.html`
7. `tools/site.mjs`
8. `RECOVERY_AUDIT_2026-08-13.md`（本报告）

## 3. 文件分类

| 文件 | 分类 | 判断与基线处理 |
|---|---|---|
| `blog/duanwen.html` | A 原网站恢复内容 | 修复返回博客索引的失效中文绝对路径；应进入基线。 |
| `blog/index.html` | A 原网站恢复内容 | 保留既有 React 产物，只修正语言、标题、描述和 noscript 文案；应进入基线。 |
| `blog/manifest.json` | A 原网站恢复内容 | 将 CRA 默认名称改为站点名称；应进入基线。 |
| `essay-01.html` | A 原网站恢复内容 | 不再链接不存在的 `essay-02.html`，保留待整理条目；应进入基线。 |
| `gallery.html` | A 原网站恢复内容 | 修复两张图片的路径；当前仍是孤立的旧照片库候选，保留不删除。 |
| `poetry/linghun/index.html` | A 原网站恢复内容 | 修复返回照片库和主页的相对路径；应进入基线。 |
| `poetry/yuwang-qingdan/index.html` | A 原网站恢复内容 | 修复固定 1200 像素 viewport；应进入基线。 |
| `.gitignore` | C 正式网站所需新结构 | 仅排除 `dist/`、`node_modules/`、`.wrangler/`；范围克制，适合正式仓库。 |
| `README.md` | C 正式网站所需新结构 | 记录静态站技术栈、开发、构建和 Pages 建议；适合正式仓库。 |
| `gallery/index.html` | C 正式网站所需新结构 | 为 `/gallery/` 提供稳定目录入口，并转到既有 `gallery/gallery.html`；应进入基线。 |
| `package.json` | B 恢复/诊断工具，现作为正式工具链 | 无第三方依赖，统一 check/build/dev/preview；适合正式仓库。 |
| `package-lock.json` | B 恢复/诊断工具，现作为正式工具链 | 锁定无依赖 npm 项目元数据；与 `package.json` 配套，应进入基线。 |
| `spare.html` | C 正式网站所需新结构 | 补齐首页原有备用入口目标；作为明确占位页进入基线。 |
| `tools/site.mjs` | B 恢复/诊断工具，现作为正式工具链 | 提供静态引用检查、构建和本地预览；不依赖大型框架，应进入基线。 |

未发现 D 类临时垃圾文件。本次没有需要删除或排除的恢复文件，也没有 E 类无法判断是否保留的文件；有冲突候选的页面仍全部保留并记录如下。

## 4. 网站当前结构

```text
归处网站/
├─ index.html                 # 总入口
├─ spare.html                # 备用入口占位页
├─ essay-01.html             # 旧文章索引候选
├─ gallery.html              # 根目录旧照片库候选
├─ art/
│  ├─ index.html
│  ├─ zhegui.html
│  └─ 16 个图片资源
├─ blog/
│  ├─ index.html             # 现行 React 预构建入口
│  ├─ duanwen.html           # 独立文章
│  ├─ src/                   # 保留的 React 源文件
│  └─ static/                # 两代构建产物及 source map
├─ gallery/
│  ├─ index.html             # /gallery/ 稳定入口
│  ├─ gallery.html           # 当前目录入口实际指向的照片库
│  └─ 8 个照片资源
├─ poetry/
│  ├─ index.html             # 诗集目录
│  └─ 19 个诗歌子目录，每个保留 index.html 与相应图片（部分诗页无图片）
├─ tools/
│  └─ site.mjs               # 检查、构建、预览
├─ package.json
├─ package-lock.json
├─ README.md
└─ .gitignore
```

仓库当前共有 30 个 HTML 页面、51 个图片/图标资源。静态网站检查范围为 30 个页面、101 个可发布文件。

## 5. 断链与缺图

- Broken links：**0**
- Missing assets：**0**
- `npm run check` 已验证 `href`、`src`、`data-full`、CSS `url(...)` 和脚本中的静态 `location.href` 引用。
- `blog/index.html` 使用 `/blog/...` 根路径引用；这些目标文件实际存在，是部署根路径设计，不是断链。
- 外部运行时依赖仍包括 Google Fonts，以及两个诗页使用的 `opencc-js` CDN；离线或第三方 CDN 故障时会发生字体回退或繁简转换失效，但不是本地缺失资源。
- 19 个诗歌子页都可由 `poetry/index.html` 到达。仅 4 个提供直接返回诗集目录的稳定链接；1 个依赖浏览器历史返回，1 个只返回主页/照片库，其余 13 个没有返回导航。这是导航一致性问题，不是断链。

## 6. 重复或冲突页面

共记录 **3 组**候选，全部保留：

1. **照片库双版本**：根目录 `gallery.html` 与 `gallery/gallery.html` 是不同实现。后者包含 8 张照片，当前 `/gallery/` 指向后者；前者只展示 2 张照片且当前孤立。两者还使用不同前端口令，但共享 `galleryAuth` localStorage 标记。下一阶段应人工决定唯一入口和内容合并方式。
2. **博客构建双版本**：`blog/static/js/main.2f97d8b3.js` 是 `asset-manifest.json` 和当前入口引用的版本；`main.70d4e2e3.js` 及配套 source map/LICENSE 是未被入口引用的旧构建版本。为保护历史暂不删除。
3. **小篆图片重复副本**：根目录 `guichu-xiaozhuan.png` 与 `poetry/guichu-xiaozhuan.png` 内容哈希完全相同。当前诗集使用 `poetry/` 下副本；根目录副本暂时无入口，保留待统一资源策略。

## 7. 孤立页面与可达性

从根 `index.html` 沿静态 HTML 链接遍历，可到达 27/30 个页面。以下 3 个页面无法从主页到达：

1. `blog/duanwen.html`：独立文章存在，但 React 博客首页和其他静态页面均未链接它。
2. `essay-01.html`：旧文章索引候选，只链接自身；没有来自主页或博客的入口。
3. `gallery.html`：根目录照片库旧版本；主页 `/gallery/` 当前进入 `gallery/gallery.html`。

另外，`art/zhegui.html` 是重要专题页，已由 `art/index.html` 正常链接；全部 19 个诗页都由诗集目录正常链接。

## 8. 安全风险

共记录 **3 项**警告：

| 等级 | 文件 | 风险 |
|---|---|---|
| 高 | `gallery.html` | 前端 JavaScript 内含明文访问口令。任何访问者都可查看源码获得，不能视为安全认证。 |
| 高 | `gallery/gallery.html` | 同样含另一组明文口令；照片文件本身位于公开静态路径，界面弹窗不能阻止直接访问。两个实现共享认证标记还会造成权限语义混乱。 |
| 低 | `blog/src/`、`blog/static/**/*.map` | 源码和 source map 会随静态站发布，可能暴露实现与历史代码。扫描未发现凭据，但后续部署前应决定是否需要公开这些开发文件。 |

未发现 `.env`、私钥、证书、token、API key、高可信度密钥格式或其他私人凭据文件。基线阶段不修改口令实现、不移动照片，也不删除 source map。

## 9. 确认应该进入恢复基线的内容

- 上述 7 个既有页面/manifest 的小范围修复。
- `/gallery/` 与 `spare.html` 两个缺失入口的补齐。
- `.gitignore` 与 `README.md`。
- `package.json`、`package-lock.json`、`tools/site.mjs` 组成的无第三方依赖静态工具链。
- 本审计报告。

这些内容共同恢复了开发、链接验证、本地预览和 production build 的基础，同时没有重构原网站或删除历史内容。

## 10. 暂时保留、以后决定

- 根 `gallery.html` 与 `gallery/gallery.html` 的最终合并和唯一规范入口。
- `essay-01.html`、`blog/duanwen.html` 是否并入统一博客索引。
- 未被引用的旧博客 bundle 是否作为历史归档保留在发布目录。
- 重复的小篆图片最终放置位置。
- 诗歌子页统一的“返回诗集/返回主页”导航。
- 照片库真正的服务端访问控制方案；在此之前不应把前端口令视为隐私保护。
- 是否从生产输出中排除 `blog/src/` 和 source map。

## 11. 下一阶段建议

1. **统一信息架构**：先确定主页、诗集、博客、照片库、艺术馆的规范 URL；为 3 个孤立页面建立明确归属，不删除内容。
2. **优先处理照片隐私**：决定照片是否允许公开；若不允许，迁移到受鉴权的存储/服务端，不再使用前端明文口令。
3. **统一构建与导航**：在本基线上整理博客单一构建产物、共享页头/返回导航和发布白名单，再进行视觉重建。

## 验证记录

- `npm run check`：通过；30 个页面、101 个可发布文件，本地引用全部解析。仓库审计文档保留在版本控制中，但不复制到 `dist/`。
- `node --check tools/site.mjs`：通过。
- `git diff --check`：通过（仅有 Windows 行尾转换提示，无 whitespace error）。
- 未运行依赖安装、技术栈升级或大规模页面重写。
