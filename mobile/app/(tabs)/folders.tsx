import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function FoldersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.title}>文件夹</Text>
        <Text style={styles.subtitle}>管理照片文件夹</Text>
        <Text style={styles.description}>
          这里将显示所有自建的文件夹{'\n'}
          可以创建新文件夹{'\n'}
          查看每个文件夹中的照片
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
