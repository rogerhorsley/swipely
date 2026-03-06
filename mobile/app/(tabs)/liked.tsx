import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Heart } from 'lucide-react-native';
import { useLikedPhotos } from '../../src/stores/useStore';
import PhotoGrid from '../../src/components/PhotoGrid';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function LikedScreen() {
  const insets = useSafeAreaInsets();
  const likedPhotos = useLikedPhotos();

  const heartOverlay = () => (
    <View style={styles.heartBadge}>
      <Heart size={12} color="#fff" fill="#fff" />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>喜欢</Text>
        <Text style={styles.count}>{likedPhotos.length}</Text>
      </View>

      {likedPhotos.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={48} color={COLORS.disabled} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>还没有喜欢的照片</Text>
          <Text style={styles.emptyHint}>在浏览页点击心形按钮</Text>
        </View>
      ) : (
        <PhotoGrid photos={likedPhotos} overlay={heartOverlay} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.secondary,
    marginLeft: SPACING.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.md,
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  heartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
