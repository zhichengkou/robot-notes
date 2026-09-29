# Robot Notes

一个面向机器人学习者的中文知识总结网站，覆盖基础理论、运动学、动力学、控制、感知与规划。

在线访问：<https://zhichengkou.github.io/robot-notes/>

![Robot Notes 页面预览](./preview.png)

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 发布到 GitHub Pages

项目已经包含 GitHub Actions 发布流程：

1. 在 GitHub 创建一个空仓库。
2. 将本项目推送到仓库的 `main` 分支。
3. 打开仓库 **Settings → Pages**，在 **Build and deployment** 中将 Source 选为 **GitHub Actions**。
4. 等待 Actions 中的 `Deploy to GitHub Pages` 完成，页面会显示网站地址。

Vite 使用相对资源路径，因此既可部署在个人主页仓库，也可部署在普通项目仓库。

## 内容维护

知识内容集中在 `src/main.jsx` 的 `notes` 数组中。复制一条记录、修改标题/分类/正文后即可添加新知识点。
