import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, FolderPlus, Folder, Plus } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import type { Folder as FolderType, Photo } from '../types';
import { useLocalUri } from '../utils/useLocalUri';

function FolderThumb({ photo }: { photo: Photo }) {
  const uri = useLocalUri(photo.id, photo.uri);
  if (!uri) return <View style={[thumbStyle, thumbPlaceholderStyle]}><Folder size={16} color={COLORS.disabled} /></View>;
  return <Image source={{ uri }} style={thumbStyle} />;
}

const thumbStyle = { width: 40, height: 40, borderRadius: 6 } as const;
const thumbPlaceholderStyle = { backgroundColor: '#F5F5F5', alignItems: 'center' as const, justifyContent: 'center' as const };

const { height: SCREEN_H } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  folders: FolderType[];
  photos: Photo[];
  onSelectFolder: (folderId: string) => void;
  onCreateFolder: (name: string) => void;
}

export default function ArchiveSheet({
  visible,
  onClose,
  folders,
  photos,
  onSelectFolder,
  onCreateFolder,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    onCreateFolder(name);
    setNewName('');
    setIsCreating(false);
  };

  const getFolderThumbPhoto = (folder: FolderType): Photo | null => {
    if (folder.photoIds.length === 0) return null;
    return photos.find((p) => p.id === folder.photoIds[0]) ?? null;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>归档到文件夹</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <X size={22} color={COLORS.secondary} />
            </Pressable>
          </View>

          {/* Create folder */}
          {isCreating ? (
            <View style={styles.createRow}>
              <TextInput
                style={styles.input}
                placeholder="文件夹名称"
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
              <Pressable onPress={() => { setIsCreating(false); setNewName(''); }}>
                <Text style={styles.cancelText}>取消</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.newFolderBtn} onPress={() => setIsCreating(true)}>
              <FolderPlus size={18} color={COLORS.primary} />
              <Text style={styles.newFolderText}>新建文件夹</Text>
            </Pressable>
          )}

          {/* Folder list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {folders.map((folder) => {
              const thumbPhoto = getFolderThumbPhoto(folder);
              return (
                <Pressable
                  key={folder.id}
                  style={styles.folderRow}
                  onPress={() => onSelectFolder(folder.id)}
                >
                  {thumbPhoto ? (
                    <FolderThumb photo={thumbPhoto} />
                  ) : (
                    <View style={[styles.thumb, styles.thumbPlaceholder]}>
                      <Folder size={16} color={COLORS.disabled} />
                    </View>
                  )}
                  <View style={styles.folderInfo}>
                    <Text style={styles.folderName}>{folder.name}</Text>
                    <Text style={styles.folderCount}>{folder.photoIds.length} 张</Text>
                  </View>
                  <Plus size={18} color={COLORS.disabled} />
                </Pressable>
              );
            })}
            {folders.length === 0 && (
              <Text style={styles.emptyText}>还没有文件夹，创建一个吧</Text>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: SCREEN_H * 0.65,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary,
  },
  newFolderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newFolderText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
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
    height: 36,
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
  confirmText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelText: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: SPACING.xl,
  },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
  },
  thumbPlaceholder: {
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary,
  },
  folderCount: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.disabled,
    fontSize: 14,
    paddingVertical: SPACING.xxl,
  },
});
