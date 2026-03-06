import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { Photo } from '../types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

interface Props {
  photo: Photo;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

export default function PhotoViewer({ photo, onSwipeUp, onSwipeDown }: Props) {
  const translateY = useSharedValue(0);

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
        <Image
          source={{ uri: photo.uri }}
          style={styles.image}
          resizeMode="cover"
        />
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
});
