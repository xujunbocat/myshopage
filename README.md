# Reviews 网站

这是一个使用 Astro + Directus + Vercel 构建的产品评测网站。网站前端样式使用 Tailwind CSS。

## 技术栈

- **Astro**: 一个现代的静态站点生成器
- **Directus**: 用于内容管理的无头CMS
- **Vercel**: 网站部署平台
- **Tailwind CSS**: 用于样式设计的实用工具优先CSS框架

## 功能

- 显示产品评测列表
- 详细的评测页面，包括评分、优缺点等信息
- 响应式设计，适配各种设备

## 开发设置

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## Directus 设置

在使用此项目前，您需要设置Directus CMS并创建以下内容集合：

### 评论集合 (reviews)

字段：
- `id`: 主键
- `title`: 评论标题
- `rating`: 评分 (1-5)
- `content`: 评论内容
- `author`: 作者
- `date_created`: 创建日期
- `image`: 图片URL
- `pros`: 优点 (可选)
- `cons`: 缺点 (可选)

## 环境变量

创建一个 `.env` 文件，包含以下变量：

```
DIRECTUS_URL=https://your-directus-url
DIRECTUS_TOKEN=your-directus-access-token
```

您需要在Directus中创建一个静态令牌。在Directus管理界面中：
1. 进入"设置" > "令牌"
2. 创建一个新的静态令牌
3. 设置适当的权限（至少需要对reviews集合的读取权限）
4. 复制生成的令牌并粘贴到`.env`文件中

## 部署

此项目已配置为使用Vercel部署。只需将代码推送到您的Git仓库，然后在Vercel上连接该仓库即可。

## 部署模式说明

本项目支持两种部署模式：

### 1. 生产模式（静态渲染）

默认模式，页面在构建时预渲染为静态HTML文件。

- 特点：更快的加载速度，更好的SEO，更低的服务器负载
- 数据源：只能访问已发布（status=published）的内容
- 缓存策略：较长时间缓存（默认3600秒）

### 2. Preview模式（SSR）

特殊模式，页面在每次请求时由服务器动态渲染。

- 特点：可以预览草稿内容，实时反映最新更改
- 数据源：可以访问所有内容，包括草稿
- 缓存策略：禁用缓存，始终获取最新内容

## 如何设置模式

### 环境变量配置

设置以下环境变量可以控制部署模式：

```
# 生产模式（静态渲染）
PUBLIC_OUTPUT_MODE=static

# Preview模式（SSR）
PUBLIC_OUTPUT_MODE=preview
```

### 部署命令

```bash
# 生产模式构建
PUBLIC_OUTPUT_MODE=static npm run build

# Preview模式构建
PUBLIC_OUTPUT_MODE=preview npm run build
```

也可以在请求URL中添加`?preview=true`参数来查看预览内容，即使在静态模式下也可以。

## 更新流程

1. 在Directus中创建和编辑内容
2. 使用preview模式/URL预览内容
3. 内容发布后，重新构建静态网站以更新生产环境 