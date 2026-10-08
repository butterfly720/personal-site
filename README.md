# 童泓昊 · 个人主页

一个**纯静态**个人网站 —— 零框架、零构建、零依赖，用原生 HTML / CSS / JavaScript 手写。

**项目位置**：`D:\网站开发\personal-site`

## 目录结构

```
D:\网站开发\personal-site\
├── index.html          # 页面结构（唯一入口）
├── css\
│   └── style.css       # 全部样式，按模块分节注释
├── js\
│   └── main.js         # 交互逻辑：技能筛选 / 导航高亮 / 滚动动画
├── .gitignore
└── README.md
```

## 本地预览

**方式一：直接打开**

双击 `D:\网站开发\personal-site\index.html` 即可。缺点是某些浏览器的 `file://` 协议下部分 API 受限。

**方式二：起一个本地服务器（推荐）**

用 Windows 终端（PowerShell 或 CMD）执行：

```bat
cd /d D:\网站开发\personal-site
python -m http.server 8000
```

然后浏览器访问 <http://localhost:8000>

如果你装了 Node，也可以用：

```bat
cd /d D:\网站开发\personal-site
npx serve .
```

## 需要你改的地方

在 `index.html` 里搜索 `your-email@example.com` 和 `github.com/你的用户名`，换成自己的。

想改自我介绍、项目内容，在 `index.html` 里直接改文字即可；
技能列表和项目卡片的内容数据集中在 `js\main.js` 顶部的 `SKILLS` 和 `PROJECTS` 两个数组里，改数据不用碰 HTML 结构。

配色统一在 `css\style.css` 顶部的 `:root` 变量里，改一处全站生效。

| 想改什么 | 改哪个文件 | 位置 |
|---|---|---|
| 名字、简介、项目描述 | `index.html` | 直接找对应文字 |
| 邮箱、GitHub 链接 | `index.html` | 搜索 `your-email` / `你的用户名` |
| 技能标签、项目卡片数据 | `js\main.js` | 顶部 `SKILLS` / `PROJECTS` 数组 |
| 全站配色 | `css\style.css` | 顶部 `:root` 变量区 |
| 断点与移动端表现 | `css\style.css` | 底部「12. 响应式」区块 |

## 部署上线

### 路线 A：GitHub Pages（免费、最简单）

在 `D:\网站开发\personal-site` 目录下打开终端执行：

```bat
cd /d D:\网站开发\personal-site
git init
git add .
git commit -m "初始化个人主页"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

推送后在仓库页面进入 **Settings → Pages**：
- Source 选 `Deploy from a branch`
- Branch 选 `main`，目录选 `/ (root)`
- 保存，等 1~2 分钟

访问 `https://你的用户名.github.io/仓库名/`

> 想用 `https://你的用户名.github.io` 这个根地址，就把仓库名命名为 `你的用户名.github.io`。

### 路线 B：Vercel（推荐，支持自动部署）

1. 打开 <https://vercel.com>，用 GitHub 账号登录
2. 点 **Add New → Project**，Import 这个仓库
3. Framework Preset 选 **Other**（纯静态无需构建），直接 Deploy
4. 拿到 `xxx.vercel.app` 域名

之后每次 `git push`，Vercel 会自动重新部署，几十秒生效。

**同类平台**：Netlify、Cloudflare Pages（国内访问速度通常更好）。

### 路线 C：自己的云服务器 + Nginx

适合想练手的场景：

```bat
:: 服务器上安装 Nginx
sudo apt update && sudo apt install -y nginx

:: 把站点文件传上去（在本地 D 盘目录下执行）
cd /d D:\网站开发
scp -r personal-site\* user@服务器IP:/var/www/mysite/
```

Nginx 配置 `/etc/nginx/sites-available/mysite`：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/mysite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

启用并重载：

```bash
sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 绑定域名与 HTTPS

1. **买域名**：阿里云 / 腾讯云 / Cloudflare / Namecheap
2. **加解析**：
   - Vercel → 加 CNAME 记录指向 Vercel 给的地址
   - 自有服务器 → 加 A 记录指向服务器公网 IP
3. **等生效**：`nslookup yourdomain.com` 验证
4. **上 HTTPS**（自有服务器）：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot 会自动改配置并配置好自动续期。用 Vercel / Cloudflare 的话 HTTPS 是自动的。

> ⚠️ 用**国内服务器**必须先完成 ICP 备案，否则域名会被拦截。用 GitHub Pages / Vercel 不需要备案，但国内访问速度可能不稳定。

## 下一步可以加的

- [ ] 博客 —— 用 Markdown 写文章，配合静态站点生成器（Hugo / Astro）自动出页面
- [ ] 深色模式切换 —— 加一个 `[data-theme="dark"]` 的 CSS 变量组
- [ ] 访问统计 —— Umami（可自建）或 Cloudflare Analytics
- [ ] 性能优化 —— 图片转 WebP、加 `loading="lazy"`
