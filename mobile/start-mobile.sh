#!/bin/bash

echo "🎨 启动 Swipely Mobile App..."
echo ""

# 检查是否在 mobile 目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 mobile 目录下运行此脚本"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，安装依赖..."
    npm install --legacy-peer-deps

    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，尝试强制安装..."
        npm install --force
    fi
fi

echo ""
echo "✅ 准备就绪！"
echo ""
echo "📱 请在手机上打开 Expo Go 应用"
echo "📷 扫描下面的二维码即可在手机上打开 APP"
echo ""
echo "💡 提示："
echo "  - 确保手机和电脑在同一 WiFi"
echo "  - 如果无法连接，按 Ctrl+C 退出，然后运行："
echo "    npm start -- --tunnel"
echo ""

# 启动开发服务器
npm start
