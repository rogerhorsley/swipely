import React, { useCallback } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import type { Photo } from '../types';

const GAP = 2;
const NUM_COLS = 3;
const SCREEN_W = Dimensions.get('window').width;
const ITEM_SIZE = (SCREEN_W - GAP * (NUM_COLS - 1)) / NUM_COLS;

interface Props {
  photos: Photo[];
  overlay?: (photo: Photo) => React.ReactNode;
}

function PhotoItem({ photo, overlay }: { photo: Photo; overlay?: Props['overlay'] }) {
  return (
    <View style={styles.item}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      {overlay?.(photo)}
    </View>
  );
}

const MemoItem = React.memo(PhotoItem);

export default function PhotoGrid({ photos, overlay }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: Photo }) => <MemoItem photo={item} overlay={overlay} />,
    [overlay],
  );

  const keyExtractor = useCallback((item: Photo) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_SIZE + GAP,
      offset: (ITEM_SIZE + GAP) * Math.floor(index / NUM_COLS),
      index,
    }),
    [],
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLS}
      getItemLayout={getItemLayout}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      initialNumToRender={15}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  item: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
});
