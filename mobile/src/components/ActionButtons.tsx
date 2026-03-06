import React, { useState, useRef, useCallback } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Heart, Trash2, FolderPlus } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface Props {
  isLiked: boolean;
  onLike: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export default function ActionButtons({ isLiked, onLike, onDelete, onArchive }: Props) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const deleteTimer = useRef<ReturnType<typeof setTimeout>>(null);

  // Like animation
  const likeScale = useSharedValue(1);
  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  // Delete shake
  const deleteX = useSharedValue(0);
  const deleteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: deleteX.value }],
  }));

  const handleLike = useCallback(() => {
    likeScale.value = withSequence(
      withSpring(1.35, { damping: 6 }),
      withSpring(1, { damping: 10 }),
    );
    onLike();
  }, [onLike]);

  const handleDelete = useCallback(() => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      deleteX.value = withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-3, { duration: 50 }),
        withTiming(3, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      deleteTimer.current = setTimeout(() => setDeleteConfirm(false), 2500);
    } else {
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
      setDeleteConfirm(false);
      onDelete();
    }
  }, [deleteConfirm, onDelete]);

  return (
    <View style={styles.container}>
      {/* Like */}
      <Animated.View style={likeAnimStyle}>
        <Pressable
          style={[styles.button, isLiked && styles.buttonActive]}
          onPress={handleLike}
        >
          <Heart
            size={22}
            color={isLiked ? '#fff' : COLORS.primary}
            fill={isLiked ? '#fff' : 'transparent'}
            strokeWidth={1.8}
          />
          <Text style={[styles.label, isLiked && styles.labelActive]}>喜欢</Text>
        </Pressable>
      </Animated.View>

      {/* Delete */}
      <Animated.View style={deleteAnimStyle}>
        <Pressable
          style={[styles.button, deleteConfirm && styles.buttonDanger]}
          onPress={handleDelete}
        >
          <Trash2
            size={22}
            color={deleteConfirm ? '#fff' : COLORS.primary}
            strokeWidth={1.8}
          />
          <Text style={[styles.label, deleteConfirm && styles.labelActive]}>
            {deleteConfirm ? '确认?' : '删除'}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Archive */}
      <Pressable style={styles.button} onPress={onArchive}>
        <FolderPlus size={22} color={COLORS.primary} strokeWidth={1.8} />
        <Text style={styles.label}>归档</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.md,
    top: '40%',
    gap: SPACING.md,
    alignItems: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  label: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: '#fff',
  },
});
