# 📱 在手机上运行 Swipely APP 的完整指南

## 方法一：使用 Expo Go（推荐 - 最快）

### 步骤 1：安装 Expo Go
在你的手机上安装 Expo Go 应用：
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 步骤 2：在本地电脑上运行项目

```bash
# 克隆仓库
git clone https://github.com/rogerhorsley/swipely.git
cd swipely/mobile

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 步骤 3：在手机上打开

启动后，你会看到一个二维码：
-  **iOS**: 打开相机 App 扫描二维码
- **Android**: 打开 Expo Go 扫描二维码

**重要**: 确保手机和电脑在同一个 WiFi 网络中！

---

## 方法二：使用 Expo Snack（在线运行 - 无需安装）

访问在线 Expo 编辑器：
https://snack.expo.dev

1. 点击 "Import"
2. 输入仓库地址: `https://github.com/rogerhorsley/swipely`
3. 扫描二维码即可在手机上打开

---

## 方法三：构建独立 APP（生产环境）

### 使用 EAS Build 构建原生应用

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录 Expo 账号
eas login

# 配置项目
eas build:configure

# 构建 Android APK
eas build --platform android --profile preview

# 构建 iOS (需要 Apple Developer 账号)
eas build --platform ios --profile preview
```

构建完成后，你会获得一个下载链接，可以直接安装到手机上。

---

## 方法四：通过 Tunnel 连接（跨网络访问）

如果手机和电脑不在同一 WiFi：

```bash
# 安装 ngrok 或使用 Expo Tunnel
npm start -- --tunnel
```

这会生成一个公网可访问的 URL，扫描二维码即可。

---

## 常见问题解决

### 1. 无法连接到开发服务器
- 确保手机和电脑在同一 WiFi
- 关闭 VPN
- 检查防火墙设置
- 使用 `--tunnel` 模式

### 2. 看到 "Network response timed out"
```bash
# 使用 LAN 模式
npm start -- --lan

# 或使用 Tunnel 模式
npm start -- --tunnel
```

### 3. 缺少依赖错误
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 4. TypeScript 错误
```bash
# 确保 TypeScript 已安装
npm install --save-dev typescript@5.3.3
```

---

## 快速测试命令（一键运行）

创建一个启动脚本 `start-mobile.sh`:

```bash
#!/bin/bash
cd mobile
npm install
npm start -- --tunnel
```

然后运行：
```bash
chmod +x start-mobile.sh
./start-mobile.sh
```

---

## 开发模式下的功能

在 Expo Go 中运行时，你可以：
- ✅ 看到所有 UI 和布局
- ✅ 测试导航和路由
- ✅ 测试手势操作
- ⚠️ 某些原生功能可能受限（相册访问需要构建独立 APP）

---

## 推荐工作流程

**开发阶段**:
```
本地开发 → Expo Go 预览 → 快速迭代
```

**测试阶段**:
```
EAS Build Preview → 安装 APK/IPA → 完整功能测试
```

**发布阶段**:
```
EAS Build Production → 提交 App Store/Google Play
```

---

## 需要帮助？

- Expo 文档: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction
- Expo Discord: https://chat.expo.dev
