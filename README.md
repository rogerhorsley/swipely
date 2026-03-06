# Swipely

相册整理应用 - 像刷抖音一样整理相册

## 项目简介

Swipely 是一个创新的相册整理应用，让整理照片变得像刷抖音一样上瘾。每次只看一张照片，全屏沉浸体验，通过简单的手势操作完成点赞、删除和归档，让整理本身变得有节奏感、停不下来。

### 核心功能

- **全屏上下滑浏览**: 一次看一张照片，垂直滑动切换，沉浸无干扰
- **点赞**: 快速标记喜欢的照片
- **删除**: 一键移除不需要的照片
- **文件夹归档**: 将照片整理到自定义文件夹
- **进度追踪**: 清晰显示整理进度

### 设计风格

故障博物馆美学 (Glitch Museum Aesthetic)：
- 泥黄暗调底色配冰蓝文字与鲜红操作色
- 轻微 RGB 通道错位和扫描线纹理
- 反直觉撞色，怪诞而有品位

## 项目结构

本仓库包含两个版本：

### 📱 Mobile (原生应用)

使用 Expo 和 React Native 构建的跨平台移动应用。

```bash
cd mobile
npm install
npm start
```

详见 [mobile/README.md](./mobile/README.md)

**技术栈**:
- Expo
- React Native
- TypeScript
- Expo Router
- React Native Gesture Handler
- React Native Reanimated

### 🌐 Web (Web应用)

使用 React + Rspack + Tailwind 构建的 Web 原型。

```bash
pnpm install
pnpm run dev
```

**技术栈**:
- React 19
- Rspack
- Tailwind CSS
- TypeScript
- Zustand (状态管理)
- Framer Motion (动画)

#### Web 开发说明

Web 版本使用自定义构建模板：

- Multi-page build pipeline by scanning `src/pages/*.page.tsx`
- Shared runtime contract through `window.App` in `src/core/app.ts`
- Data/theme preload support from `src/data/*.json`

**目录结构**:
- `src/data/` - 应用数据
- `src/components/` - UI 组件
- `src/pages/` - 页面文件
- `src/stores/` - 状态管理
- `src/core/` - 运行时核心（模板内部）

**运行时 API**:
- `window.App.store` - 全局状态
- `window.App.theme` - 主题配置
- `window.App.transitionTo(pageId, params?)` - 页面跳转
- `window.App.goBack()` - 返回上一页

## 设计规格

查看 [design-specs/](./design-specs/) 目录获取：
- 产品简报 (product-brief.md)
- 线框图 (wireframe.jpg)

## 开始使用

### Mobile (推荐)

```bash
cd mobile
npm install
npm start
```

然后：
- 按 `i` 打开 iOS 模拟器
- 按 `a` 打开 Android 模拟器
- 使用 Expo Go 扫描二维码在真机运行

### Web

```bash
pnpm install
pnpm run dev
```

在浏览器中访问 `http://localhost:8080`

## 路线图

- [x] Web 原型实现
- [x] Expo 项目搭建
- [ ] 集成设备相册
- [ ] 实现手势滑动
- [ ] 添加动画效果
- [ ] 实现故障美学效果
- [ ] 添加数据持久化
- [ ] 性能优化

## 贡献

欢迎提交 Issues 和 Pull Requests！

## License

MIT

---

Made with ❤️ by HappyCapy Team
