import React from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { Photo } from '../types';
import { useLocalUri } from '../utils/useLocalUri';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

interface Props {
  photo: Photo;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export default function PhotoViewer({ photo, onSwipeUp, onSwipeDown }: Props) {
  const translateY = useSharedValue(0);
  const localUri = useLocalUri(photo.id, photo.uri);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .onUpdate((e) => {
      translateY.value = e.translationY * 0.5;
    })
    .onEnd((e) => {
      if (e.translationY < -SWIPE_THRESHOLD) {
        runOnJS(onSwipeUp)();
      } else if (e.translationY > SWIPE_THRESHOLD) {
        runOnJS(onSwipeDown)();
      }
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animStyle]}>
        {localUri ? (
          <Image
            source={{ uri: localUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
