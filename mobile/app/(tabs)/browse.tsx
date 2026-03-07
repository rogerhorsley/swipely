import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { useStore, useActivePhotos, useCurrentPhoto } from '../../src/stores/useStore';
import PhotoViewer from '../../src/components/PhotoViewer';
import ActionButtons from '../../src/components/ActionButtons';
import ArchiveSheet from '../../src/components/ArchiveSheet';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function BrowseScreen() {
  const insets = useSafeAreaInsets();

  const loadPhotos = useStore((s) => s.loadPhotos);
  const loadPersisted = useStore((s) => s.loadPersisted);
  const isLoading = useStore((s) => s.isLoading);
  const hasPermission = useStore((s) => s.hasPermission);
  const currentIndex = useStore((s) => s.currentIndex);
  const likedIds = useStore((s) => s.likedIds);
  const folders = useStore((s) => s.folders);
  const photos = useStore((s) => s.photos);
  const isArchiveSheetOpen = useStore((s) => s.isArchiveSheetOpen);
  const toggleLike = useStore((s) => s.toggleLike);
  const deletePhoto = useStore((s) => s.deletePhoto);
  const archiveToFolder = useStore((s) => s.archiveToFolder);
  const createFolder = useStore((s) => s.createFolder);
  const openArchiveSheet = useStore((s) => s.openArchiveSheet);
  const closeArchiveSheet = useStore((s) => s.closeArchiveSheet);
  const advanceToNext = useStore((s) => s.advanceToNext);
  const goToPrevious = useStore((s) => s.goToPrevious);

  const activePhotos = useActivePhotos();
  const currentPhoto = useCurrentPhoto();

  // Heart pop animation
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);
  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }));

  useEffect(() => {
    loadPersisted().then(() => loadPhotos());
  }, []);

  const handleLike = useCallback(() => {
    if (!currentPhoto) return;
    const wasLiked = likedIds.includes(currentPhoto.id);
    toggleLike(currentPhoto.id);
    if (!wasLiked) {
      heartScale.value = withSequence(
        withSpring(1.4, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 8 }),
      );
      heartOpacity.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 200 }),
      );
    }
  }, [currentPhoto, likedIds, toggleLike]);

  const handleDelete = useCallback(async () => {
    if (!currentPhoto) return;
    const deleted = await deletePhoto(currentPhoto.id);
    if (deleted) advanceToNext();
  }, [currentPhoto, deletePhoto, advanceToNext]);

  const handleSelectFolder = useCallback(
    async (folderId: string) => {
      if (!currentPhoto) return;
      await archiveToFolder(currentPhoto.id, folderId);
      closeArchiveSheet();
      advanceToNext();
    },
    [currentPhoto, archiveToFolder, closeArchiveSheet, advanceToNext],
  );

  const handleCreateFolder = useCallback(
    async (name: string) => {
      if (!currentPhoto) return;
      const folderId = await createFolder(name);
      await archiveToFolder(currentPhoto.id, folderId);
      closeArchiveSheet();
      advanceToNext();
    },
    [currentPhoto, createFolder, archiveToFolder, closeArchiveSheet, advanceToNext],
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Loading
  if (isLoading) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>加载照片中...</Text>
      </View>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" />
        <Text style={styles.emptyTitle}>需要相册权限</Text>
        <Text style={styles.emptyHint}>请在设置中允许 Swipely 访问你的照片</Text>
        <Pressable style={styles.settingsBtn} onPress={() => Linking.openSettings()}>
          <Text style={styles.settingsBtnText}>打开设置</Text>
        </Pressable>
      </View>
    );
  }

  // All done
  if (!currentPhoto && activePhotos.length === 0 && photos.length > 0) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" />
        <Text style={styles.emptyTitle}>全部整理完毕!</Text>
        <Text style={styles.emptyHint}>所有照片都已处理</Text>
      </View>
    );
  }

  // No photos
  if (!currentPhoto) {
    return (
      <View style={styles.center}>
        <StatusBar style="dark" />
        <Text style={styles.emptyTitle}>没有照片</Text>
        <Text style={styles.emptyHint}>设备上没有找到照片</Text>
      </View>
    );
  }

  const isLiked = likedIds.includes(currentPhoto.id);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <PhotoViewer
        photo={currentPhoto}
        onSwipeUp={advanceToNext}
        onSwipeDown={goToPrevious}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
        <Text style={styles.topTitle}>相册整理</Text>
        <Text style={styles.topProgress}>
          {currentIndex + 1} / {activePhotos.length}
        </Text>
      </View>

      {/* Bottom info */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 68 }]}>
        <Text style={styles.dateText}>{formatDate(currentPhoto.date)}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / activePhotos.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ActionButtons
        isLiked={isLiked}
        onLike={handleLike}
        onDelete={handleDelete}
        onArchive={openArchiveSheet}
      />

      {/* Heart pop */}
      <Animated.View style={[styles.heartPop, heartAnimStyle]} pointerEvents="none">
        <Heart size={80} color={COLORS.primary} fill={COLORS.primary} />
      </Animated.View>

      <ArchiveSheet
        visible={isArchiveSheetOpen}
        onClose={closeArchiveSheet}
        folders={folders}
        photos={photos}
        onSelectFolder={handleSelectFolder}
        onCreateFolder={handleCreateFolder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: { marginTop: SPACING.md, fontSize: 15, color: COLORS.secondary },
  emptyTitle: { fontSize: 22, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm },
  emptyHint: { fontSize: 14, color: COLORS.secondary, textAlign: 'center' },
  settingsBtn: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  settingsBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  topTitle: { fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  topProgress: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dateText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: SPACING.sm },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 1,
    marginBottom: SPACING.sm,
  },
  progressFill: { height: 2, backgroundColor: '#fff', borderRadius: 1 },
  heartPop: { position: 'absolute', top: '42%', alignSelf: 'center' },
});
