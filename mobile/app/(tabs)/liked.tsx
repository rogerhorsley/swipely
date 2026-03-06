import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function LikedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>喜欢</Text>
        <Text style={styles.subtitle}>查看所有点赞的照片</Text>
        <Text style={styles.description}>
          这里将显示所有被标记为喜欢的照片{'\n'}
          以网格形式展示{'\n'}
          方便快速查看和管理
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
    color: '#FF4757',
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
