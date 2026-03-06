# Swipely Mobile

相册整理应用的原生移动版本 - 使用 Expo 和 React Native 构建

## 项目简介

像刷抖音一样整理相册。每次只看一张照片，全屏沉浸，右侧一排按钮完成点赞/删除/归档，让整理本身变得有节奏感、停不下来。

## 核心功能

- **全屏上下滑浏览**: 一次看一张照片，垂直滑动切换，沉浸无干扰
- **点赞**: 右侧按钮标记喜欢，照片留存
- **删除**: 右侧按钮一键移除，自动进入下一张
- **添加到文件夹**: 右侧按钮，底部弹出选择器，选择或新建文件夹归档
- **文件夹管理**: 查看所有自建文件夹及内容
- **点赞收藏**: 集中查看所有点赞照片
- **进度提示**: 顶部显示整理进度（第几张/共几张）

## 技术栈

- **Expo**: 跨平台开发框架
- **Expo Router**: File-based 路由
- **React Native**: UI 框架
- **TypeScript**: 类型安全
- **React Native Gesture Handler**: 手势交互
- **React Native Reanimated**: 流畅动画
- **Expo Media Library**: 相册访问

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 在设备上运行

- **iOS 模拟器**: 按 `i`
- **Android 模拟器**: 按 `a`
- **物理设备**: 使用 Expo Go app 扫描二维码

### 在特定平台启动

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 项目结构

```
mobile/
├── app/                    # Expo Router 路由文件
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx    # Tabs 布局
│   │   ├── browse.tsx     # 浏览页面
│   │   ├── liked.tsx      # 喜欢页面
│   │   └── folders.tsx    # 文件夹页面
│   ├── _layout.tsx        # 根布局
│   └── index.tsx          # 入口重定向
├── src/
│   ├── components/        # 可复用组件
│   ├── stores/           # 状态管理
│   └── types/            # TypeScript 类型定义
├── assets/               # 图片和其他资源
├── app.json             # Expo 配置
└── package.json         # 项目依赖
```

## 设计风格

故障博物馆美学：
- 泥黄暗调底色 (#C4A57B)
- 冰蓝文字 (#7FCDFF)
- 鲜红操作色 (#FF4757)
- 轻微 RGB 通道错位和扫描线纹理
- 反直觉撞色，怪诞而有品位

## 相册权限

应用需要访问设备相册权限：

- **iOS**: 自动请求相册访问权限
- **Android**: 需要 READ_EXTERNAL_STORAGE 和 READ_MEDIA_IMAGES 权限

## 开发计划

- [ ] 实现全屏照片浏览
- [ ] 添加手势滑动功能
- [ ] 集成设备相册
- [ ] 实现点赞/删除/归档操作
- [ ] 添加文件夹管理功能
- [ ] 优化动画效果
- [ ] 实现故障美学效果

## License

MIT
