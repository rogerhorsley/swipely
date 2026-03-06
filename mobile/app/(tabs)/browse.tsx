import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function BrowseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>浏览</Text>
        <Text style={styles.subtitle}>全屏上下滑动浏览照片</Text>
        <Text style={styles.description}>
          这里将实现全屏照片浏览功能{'\n'}
          可以上下滑动切换照片{'\n'}
          右侧按钮进行点赞/删除/归档操作
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4A57B',
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7FCDFF',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 18,
    color: '#7FCDFF',
    marginBottom: 24,
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.6,
  },
});
