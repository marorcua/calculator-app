/** @format */

import { ChevronDown, ChevronUp } from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

interface NumberRouletteProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  format?: (value: number) => string
  error?: string
}

const ITEM_HEIGHT = 52
const VISIBLE_ITEMS = 5 // must be odd
const SIDE_ITEMS = Math.floor(VISIBLE_ITEMS / 2)
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

export const NumberRoulette = ({
  value,
  onChange,
  min = 0,
  max = 500000,
  step = 10000,
  format = (v) => `$${v.toLocaleString()}`,
  error
}: NumberRouletteProps) => {
  const listRef = useRef<FlatList>(null)
  const isScrolling = useRef(false)

  // Build the full list of selectable values
  const items = useMemo(() => {
    const result: number[] = []
    for (let v = min; v <= max; v += step) result.push(v)
    return result
  }, [min, max, step])
  const indexForValue = useCallback(
    (v: number) => {
      const raw = Math.round((v - min) / step)
      return Math.max(0, Math.min(items.length - 1, raw))
    },
    [min, step, items.length]
  )
  const [centeredIndex, setCenteredIndex] = useState(() => indexForValue(value))

  // Pad with nulls so the selected item always centers in the window
  const paddedItems = useMemo(
    () => [
      ...Array(SIDE_ITEMS).fill(null),
      ...items,
      ...Array(SIDE_ITEMS).fill(null)
    ],
    [items]
  )

  const scrollToIndex = useCallback((index: number, animated = true) => {
    listRef.current?.scrollToIndex({
      index: index + SIDE_ITEMS,
      animated,
      viewOffset: 0
    })
  }, [])

  const handleScroll = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT))
      )
      setCenteredIndex(idx)
    },
    [items.length]
  )

  const handleScrollEnd = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const clampedIndex = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT))
      )
      scrollToIndex(clampedIndex, true)
      setCenteredIndex(clampedIndex)
      onChange(items[clampedIndex])
      isScrolling.current = false
    },
    [items, onChange, scrollToIndex]
  )

  const handleIncrement = useCallback(() => {
    const current = indexForValue(value)
    const next = Math.min(items.length - 1, current + 1)
    scrollToIndex(next)
    setCenteredIndex(next)
    onChange(items[next])
  }, [value, items, indexForValue, scrollToIndex, onChange])

  const handleDecrement = useCallback(() => {
    const current = indexForValue(value)
    const prev = Math.max(0, current - 1)
    scrollToIndex(prev)
    setCenteredIndex(prev)
    onChange(items[prev])
  }, [value, items, indexForValue, scrollToIndex, onChange])

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<number | null>) => {
      if (item === null) return <View style={{ height: ITEM_HEIGHT }} />
      const realIndex = index - SIDE_ITEMS
      const distance = Math.abs(realIndex - centeredIndex)
      return (
        <View style={styles.item}>
          <Text
            style={[
              styles.itemText,
              distance === 0 && styles.itemTextActive,
              distance === 1 && styles.itemTextNear,
              distance >= 2 && styles.itemTextFar
            ]}
          >
            {format(item)}
          </Text>
        </View>
      )
    },
    [centeredIndex, format]
  )

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index
    }),
    []
  )

  const initialScrollIndex = useMemo(
    () => indexForValue(value) + SIDE_ITEMS,
    // only compute once at mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <View>
      <View
        style={[
          styles.container,
          error ? styles.containerError : styles.containerNormal
        ]}
      >
        {/* Up button */}
        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          hitSlop={8}
        >
          <ChevronUp
            size={22}
            color='#6b7280'
          />
        </Pressable>

        {/* Scroll window */}
        <View
          style={styles.window}
          pointerEvents='box-none'
        >
          {/* Selection highlight */}
          <View
            style={styles.selectionBar}
            pointerEvents='none'
          />

          {/* Fade overlays */}
          <View
            style={[styles.fade, styles.fadeTop]}
            pointerEvents='none'
          />
          <View
            style={[styles.fade, styles.fadeBottom]}
            pointerEvents='none'
          />

          <FlatList
            ref={listRef}
            data={paddedItems as (number | null)[]}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            initialScrollIndex={initialScrollIndex}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate='fast'
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            bounces={false}
            overScrollMode='never'
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>

        {/* Down button */}
        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          hitSlop={8}
        >
          <ChevronDown
            size={22}
            color='#6b7280'
          />
        </Pressable>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.stepLabel}>±{format(step)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden'
  },
  containerNormal: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff'
  },
  containerError: {
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5'
  },
  btn: {
    width: 48,
    height: CONTAINER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  btnPressed: {
    backgroundColor: '#f3f4f6'
  },
  window: {
    flex: 1,
    height: CONTAINER_HEIGHT,
    overflow: 'hidden',
    position: 'relative'
  },
  list: {
    flex: 1
  },
  listContent: {
    // no extra padding needed — padding is handled by null items
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#111827'
  },
  itemTextActive: {
    fontSize: 26,
    fontWeight: '600',
    color: '#111827'
  },
  itemTextNear: {
    fontSize: 18,
    color: '#6b7280'
  },
  itemTextFar: {
    fontSize: 14,
    color: '#d1d5db'
  },
  selectionBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: ITEM_HEIGHT * SIDE_ITEMS,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    zIndex: 1
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * SIDE_ITEMS,
    zIndex: 2,
    pointerEvents: 'none'
  },
  fadeTop: {
    top: 0
    // gradient via background not available in RN — use opacity on items instead (handled in text styles)
  },
  fadeBottom: {
    bottom: 0
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4
  },
  stepLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 6,
    marginLeft: 4
  }
})
