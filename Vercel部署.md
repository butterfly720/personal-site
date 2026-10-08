# Vercel 部署说明

> 本文件专门讲 Vercel 方案。通用 Git 操作与 GitHub Pages 方案见 `部署手册.md`。

## 为什么选 Vercel

| 优势 | 说明 |
|---|---|
| 全自动部署 | 每次 `git push` 自动重新构建，无需任何手动操作 |
| 速度快 | 20~40 秒生效（GitHub Pages 需 1~2 分钟） |
| 预览环境 | 每个分支自动生成独立预览网址，改版不影响正式站 |
| 零配置 | 纯静态站不需要构建命令、不需要输出目录 |
| 自动 HTTPS | 证书自动签发与续期，无需任何操作 |
| 回滚简单 | 控制台点一下就能退到任意历史版本 |
| 免费额度 | 个人项目完全够用（每月 100GB 流量） |

---

## 前置条件

Vercel **不直接读取你电脑上的文件夹**。它的工作链路是：

```
D:\网站开发\personal-site  →  git push  →  GitHub 仓库  →  Vercel 侦听  →  自动部署
```

所以必须先把代码推到 GitHub，Vercel 才有东西可部署。

---

## 第 1 步：创建 GitHub 仓库

1. 浏览器打开 <https://github.com/new>
2. **Repository name** 填 `personal-site`
3. 选 **Public**
4. ⚠️ 三个初始化选项（README / .gitignore / license）**全部不要勾选**
5. 点 **Create repository**

---

## 第 2 步：推送代码

```bat
cd /d D:\网站开发\personal-site
git remote add origin https://github.com/butterfly/personal-site.git
git push -u origin main
```

> `butterfly` 对应当前 Git 全局配置的用户名。若实际 GitHub 用户名不同，替换即可。

### 推送时要求登录怎么办

GitHub 已禁用账号密码推送 Git，需要 Personal Access Token：

1. 打开 <https://github.com/settings/tokens> → **Generate new token (classic)**
2. Expiration 选 90 天，勾选 **`repo`** 权限，生成
3. **立刻复制** token（只显示一次）
4. 推送弹窗中：用户名填 `butterfly`，密码处**粘贴 token**

**更省事的替代方案** —— 安装 GitHub CLI：

```bat
winget install --id GitHub.cli
gh auth login
```

选 `GitHub.com` → `HTTPS` → `Login with a web browser`，浏览器授权一次，之后永久免密。

---

## 第 3 步：连接 Vercel

1. 打开 <https://vercel.com>
2. 点 **Sign Up**（已有账号则 Log In）
3. 选 **Continue with GitHub**，授权 Vercel 访问你的仓库
4. 进入控制台后，点 **Add New...** → **Project**
5. 在 **Import Git Repository** 列表里找到 `personal-site`，点 **Import**

> 如果列表里没看到，点 **Adjust GitHub App Permissions** 授予访问权限。

### 项目配置（关键）

| 配置项 | 填什么 | 说明 |
|---|---|---|
| Framework Preset | **Other** | 本项目无框架 |
| Root Directory | 保持默认 | 仓库根目录即站点根目录 |
| Build Command | **留空** | 纯静态无构建步骤 |
| Output Directory | **留空** | 同上 |
| Install Command | **留空** | 无依赖需要安装 |

然后点 **Deploy**，等约 20 秒。

---

## 第 4 步：拿到访问地址

部署成功后，Vercel 会给出默认域名，形如：

```
https://personal-site-xxxx.vercel.app
```

在项目页面的 **Domains** 里点进去就能看到，也能自己改成更好记的名字（如 `personal-site-butterfly.vercel.app`，未被占用即可）。

⚠️ **国内访问提醒**：`*.vercel.app` 域名在国内可能被 DNS 污染或访问不稳。**绑定自己的域名后速度会明显改善**，这也是一开始就建议买域名的原因。

---

## 第 5 步：绑定自定义域名（可选，推荐）

### 5.1 在 Vercel 添加域名

项目页面 → **Settings** → **Domains** → 输入你的域名 → **Add**

Vercel 会告诉你需要添加什么 DNS 记录，通常两种：

| 类型 | 名称 | 值 |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

> 实际值以 Vercel 界面显示的为准，它可能随节点调整。

### 5.2 在域名服务商添加记录

登录你买域名的平台（阿里云 / 腾讯云 / Cloudflare / Namecheap），
进入 DNS 解析页面，按上表添加记录。

### 5.3 验证

```bat
nslookup 你的域名.com
```

返回 Vercel 的 IP 即生效。DNS 传播通常几分钟，最长几小时。

### 5.4 HTTPS

生效后 Vercel **自动签发证书**，无需任何操作。等状态变成绿色的 `Valid Configuration` 就可以了。

---

## 日常更新流程

以后改了网站，只需三条命令：

```bat
cd /d D:\网站开发\personal-site
git add .
git commit -m "改了什么"
git push
```

推完什么都不用做，Vercel 会自动部署。约 30 秒后刷新网站即可看到新版本。

---

## 预览环境怎么用

这是 Vercel 最有价值的功能。举例：

```bat
cd /d D:\网站开发\personal-site
git switch -c dark-mode        :: 开分支
:: ...改代码...
git add .
git commit -m "尝试深色模式"
git push -u origin dark-mode   :: 推分支（不是 main）
```

推送后 Vercel 会自动部署这个分支，**并给出一个独立预览网址**。

- 满意 → 在 GitHub 上开 Pull Request 合并进 `main`，正式站才更新
- 不满意 → 删掉分支，正式站从头到尾**没有受到任何影响**

---

## 常用配置说明（vercel.json）

项目根目录的 `vercel.json` 已配置好以下内容：

| 配置 | 作用 |
|---|---|
| `cleanUrls: true` | 允许用 `/about` 访问 `about.html`，URL 更干净 |
| `trailingSlash: false` | 统一去掉结尾斜杠，避免同一页面出现两个地址 |
| 安全响应头 | 禁止 MIME 嗅探、限制页面被 iframe 嵌套、控制 Referer 传递 |
| 静态资源缓存 | `css/` 与 `js/` 目录缓存一年，加快二次访问 |

> 改完 `vercel.json` 也要 `git push` 才会生效。

---

## 常见问题

| 现象 | 原因与解决 |
|---|---|
| Import 列表里找不到仓库 | Vercel 没有仓库访问权限 → 点 Adjust GitHub App Permissions 授予 |
| 部署报 `No Output Directory named 'public'` | 误选了框架预设 → 删掉项目重建，Framework Preset 选 **Other** |
| 访问显示 404 | 检查仓库根目录是否有 `index.html`，用 `git ls-files` 核对 |
| 样式全丢 | CSS 用了绝对路径 → 本项目用相对路径 `css/style.css`，确认目录结构完整 |
| 推送被拒 `non-fast-forward` | 建仓库时勾了 README → 执行 `git pull --rebase origin main` 后再 push |
| 部署成功但页面没变 | 浏览器缓存 → `Ctrl + F5` 强制刷新 |
| 想回退到旧版本 | 项目 → **Deployments** → 找到历史版本 → 点 **Promote to Production** |

---

## 与其他平台对比

| 平台 | 特点 | 适合 |
|---|---|---|
| **Vercel** | 体验最好，自动部署，预览环境 | 首选 |
| Cloudflare Pages | 国内访问通常最快，免费额度大 | 追求国内速度 |
| Netlify | 与 Vercel 类似，功能接近 | 备选 |
| GitHub Pages | 最简单，但需手动开启、无预览环境 | 纯静态极简需求 |
| 自建服务器 | 完全可控，能练 Nginx | 学习目的 |
