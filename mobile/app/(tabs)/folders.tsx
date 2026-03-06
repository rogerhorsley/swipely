import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Folder, FolderPlus } from 'lucide-react-native';
import { useStore } from '../../src/stores/useStore';
import { useLocalUri } from '../../src/utils/useLocalUri';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import type { Photo, Folder as FolderType } from '../../src/types';

function ThumbImage({ photo }: { photo: Photo }) {
  const uri = useLocalUri(photo.id, photo.uri);
  if (!uri) return <View style={styles.thumb} />;
  return <Image source={{ uri }} style={styles.thumb} />;
}

function FolderCard({
  folder,
  photos,
}: {
  folder: FolderType;
  photos: Photo[];
}) {
  const folderPhotos = photos.filter((p) => folder.photoIds.includes(p.id));
  const thumbs = folderPhotos.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Folder size={18} color={COLORS.primary} strokeWidth={1.5} />
        <Text style={styles.folderName} numberOfLines={1}>
          {folder.name}
        </Text>
        <Text style={styles.photoCount}>{folderPhotos.length} 张</Text>
      </View>
      <View style={styles.thumbStrip}>
        {thumbs.length > 0 ? (
          thumbs.map((p) => (
            <ThumbImage key={p.id} photo={p} />
          ))
        ) : (
          <View style={styles.emptyStrip}>
            <Text style={styles.emptyStripText}>暂无照片</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function FoldersScreen() {
  const insets = useSafeAreaInsets();
  const folders = useStore((s) => s.folders);
  const photos = useStore((s) => s.photos);
  const createFolder = useStore((s) => s.createFolder);

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    createFolder(name);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>文件夹</Text>
          <Text style={styles.count}>{folders.length}</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => setIsCreating(true)}
        >
          <FolderPlus size={16} color={COLORS.primary} strokeWidth={1.8} />
          <Text style={styles.addBtnText}>新建</Text>
        </Pressable>
      </View>

      {/* Create input */}
      {isCreating && (
        <View style={styles.createRow}>
          <TextInput
            style={styles.input}
            placeholder="输入文件夹名称"
            placeholderTextColor={COLORS.disabled}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleCreate}
            autoFocus
            returnKeyType="done"
          />
          <Pressable style={styles.confirmBtn} onPress={handleCreate}>
            <Text style={styles.confirmText}>确认</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsCreating(false);
              setNewName('');
            }}
          >
            <Text style={styles.cancelText}>取消</Text>
          </Pressable>
        </View>
      )}

      {folders.length === 0 && !isCreating ? (
        <View style={styles.empty}>
          <Folder size={48} color={COLORS.disabled} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>还没有创建文件夹</Text>
          <Text style={styles.emptyHint}>在浏览页归档照片时可以创建</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} photos={photos} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'baseline' },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.primary },
  count: { fontSize: 16, fontWeight: '500', color: COLORS.secondary, marginLeft: SPACING.sm },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  addBtnText: { fontSize: 13, fontWeight: '500', color: COLORS.primary },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  input: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.primary,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  confirmText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  cancelText: { color: COLORS.secondary, fontSize: 13 },
  list: { flex: 1 },
  listContent: { padding: SPACING.xl, gap: SPACING.md },
  card: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  folderName: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.primary },
  photoCount: { fontSize: 13, color: COLORS.secondary },
  thumbStrip: {
    flexDirection: 'row',
    height: 72,
    gap: 2,
    paddingHorizontal: 2,
    paddingBottom: 2,
  },
  thumb: { flex: 1, borderRadius: RADIUS.sm },
  emptyStrip: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStripText: { fontSize: 12, color: COLORS.disabled },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: COLORS.primary, marginTop: SPACING.md },
  emptyHint: { fontSize: 14, color: COLORS.secondary },
});
