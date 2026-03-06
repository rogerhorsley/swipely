# 🚀 快速开始 - 3步在手机上运行 Swipely

## 最快方式（2分钟）

### 1️⃣ 下载 Expo Go
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2️⃣ 在电脑上运行
```bash
git clone https://github.com/rogerhorsley/swipely.git
cd swipely/mobile
npm install
npm start
```

### 3️⃣ 扫描二维码
用手机扫描终端显示的二维码，APP 就会在 Expo Go 中打开！

---

## 如果遇到问题

### 手机和电脑不在同一 WiFi？
```bash
npm start -- --tunnel
```

### 依赖安装失败？
```bash
npm install --legacy-peer-deps
```

### 看不到二维码？
```bash
# 使用 LAN 模式
npm start -- --lan

# 会显示类似这样的 URL:
# exp://192.168.1.100:8081
# 在 Expo Go 中手动输入这个地址
```

---

## 在线体验（无需安装）

访问: https://snack.expo.dev

将代码复制粘贴进去，点击"My Device"扫描二维码即可！

---

## 注意事项

- ⚠️ 确保手机和电脑在同一网络
- ⚠️ 关闭 VPN 可能会提高连接稳定性
- ⚠️ 首次启动可能需要等待几分钟下载依赖
