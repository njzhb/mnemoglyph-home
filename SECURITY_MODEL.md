# Mnemoglyph「归处」Security Model v1

日期：2026-08-13

## 目标

“归处”当前是静态网站。静态 HTML、JavaScript、图片和 source map 一旦发布，访问者就能下载并检查，因此客户端代码不能承担真正的身份验证，也不能保存密码、token、API key、签名密钥或存储凭据。

本阶段的目标是消除安全假象、明确公开与私密边界，并为未来边缘侧认证保留清晰接口；不在未确认现有 Cloudflare 项目配置的情况下仓促引入账户、Secrets 或新的生产资源。

## 当前公开内容

以下内容按公开网站处理：

- `/`：归处总入口
- `/poetry/` 及全部诗歌子页
- `/blog/` 与 `/blog/duanwen.html`
- `/art/` 与藏品专题页
- `/gallery/` 当前陈列及 `gallery/` 下现有图片
- `/archive/` 及其保留的 legacy 页面
- 所有随公开页面发布的 CSS、JavaScript、manifest、字体引用和图片

`gallery/` 中的现有图片已经位于公开静态路径。本阶段不宣称它们受到密码保护。

## 未来可能需要私密的内容

- 未经选择公开的私人照片
- 仅限指定身份访问的家庭/个人档案
- 未公开手稿、通信、账户资料或带有个人信息的原始文件

这些内容不得继续放在公开仓库或静态 `dist/` 中。若内容实际需要私密，应先迁移出公开路径，再上线私密入口。

## 不能存在客户端的内容

- 真实密码及密码哈希
- API token、Cloudflare token、R2 Access Key/Secret、签名密钥
- 允许绕过认证的固定 header、query 参数或 localStorage 标记
- 可恢复真实秘密的 Base64、混淆字符串或前端加密材料
- 未经过服务端授权即可枚举的私密对象清单

## Gallery 推荐访问控制边界

推荐将未来私密 Gallery 与当前公开 `/gallery/` 分开：

1. **入口**：使用独立路径或自定义主机，例如 `/private-gallery/` 或 `private.example.com`。
2. **身份层**：由 Cloudflare Access 或等价的身份感知代理在请求到达应用前执行登录和 Allow policy；静态页面不自行比较密码。
3. **授权层**：若需按用户或对象授权，由 Worker/Pages Function 验证 Access 身份/JWT，并决定可见相册与对象。
4. **存储层**：私密原图放入非公开 R2 bucket 或等价私有存储，不复制进公开 `dist/`。
5. **对象读取**：经授权后由边缘函数读取 R2，或生成短期、单对象的 signed URL。签名凭据只存在服务端 Secret 中。
6. **失败边界**：未认证或无权限请求返回 401/403；不能依赖隐藏按钮、JS 变量或 localStorage。

Cloudflare Access 可按具体 hostname/path 保护应用，并在允许请求通过前执行身份策略；R2 的临时 URL或 Worker 读取可用于授权后的对象访问。具体账户绑定、域名和 Secrets 必须在部署阶段单独确认。

## 本阶段实际实施

- 从 `gallery.html` 与 `gallery/gallery.html` 删除两组硬编码客户端口令、密码输入框、localStorage 认证标记及相关判断逻辑。
- 明确 `/gallery/` 是当前唯一正式入口，并明确现有陈列为公开内容。
- 保留根 `gallery.html` 作为 Archive/Legacy 页面，不删除历史实现和两张图片内容。
- 建立 `/archive/`，使 legacy 页面可被正常理解与到达。
- 构建仍保留博客运行所需的已引用 bundle，但从生产输出排除 `blog/src/`、全部 `*.map` 以及未被入口引用的旧 `main.70d4e2e3.js` 及其 LICENSE；仓库历史文件不删除。
- 未创建 Cloudflare Access 应用、R2 bucket、Worker、Secrets 或新的生产域名。
- 旧客户端口令字符串仍可能存在于公开 Git 历史和旧部署快照中，但当前分支源码与构建不再使用它们。它们从来不应被视为真实凭据；若曾复用于其他系统，应在对应系统单独轮换。

## 剩余风险与部署要求

### 当前剩余警告：1 项，中风险

现有 Gallery 图片仍是公开文件。如果其中任何图片不应公开，仅移除客户端密码并不能保护它；必须在部署前将对应文件迁出公开仓库和 `dist/`。本阶段无法替用户判断每张历史照片的隐私属性，因此保留并明确标注公开状态。

### 后续真正启用私密 Gallery 需要

1. 确认允许访问的人群和身份提供方。
2. 确认自定义域名/路径并配置 Cloudflare Access policy。
3. 创建私有对象存储，迁移私密照片并验证公开构建中不存在副本。
4. 在 Worker/Pages Function 中验证身份和授权；通过托管 Secret 注入服务端凭据。
5. 测试匿名、已登录无权限、已授权和链接过期四种路径。

在这些条件完成前，`/gallery/` 只能作为公开陈列，不能称为私密照片库。

## 参考实现资料

- Cloudflare Access 可作为身份感知代理保护公开 hostname 与具体路径：<https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/>
- Access application path 可为同一站点的不同路径配置不同策略：<https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/>
- R2 presigned URL 可在不向浏览器暴露 API 凭据的前提下授予短时单对象访问，但 URL 本身应视为 bearer token：<https://developers.cloudflare.com/r2/api/s3/presigned-urls/>
- Worker 读取 R2 时必须在服务端实现授权并保护 bucket 操作：<https://developers.cloudflare.com/r2/api/workers/workers-api-usage/>
