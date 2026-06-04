/** @format */

import { formatCurrency } from "@/domain/math/math";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface NumberRouletteProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  error?: string;
}

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5; // must be odd
const SIDE_ITEMS = Math.floor(VISIBLE_ITEMS / 2);
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const NumberRoulette = ({
  value,
  onChange,
  min = 0,
  max = 500000,
  step = 10000,
  format = (v) => formatCurrency(v),
  error,
}: NumberRouletteProps) => {
  const scrollRef = useRef<ScrollView>(null);

  const items = useMemo(() => {
    const result: number[] = [];
    for (let v = min; v <= max; v += step) result.push(v);
    return result;
  }, [min, max, step]);

  const indexForValue = useCallback(
    (v: number) => {
      const raw = Math.round((v - min) / step);
      return Math.max(0, Math.min(items.length - 1, raw));
    },
    [min, step, items.length],
  );

  const [centeredIndex, setCenteredIndex] = useState(() => {
    const raw = Math.round((value - min) / step);
    return Math.max(0, Math.min(Math.floor((max - min) / step), raw));
  });

  // Ref for immediate access without stale closures
  const indexRef = useRef(centeredIndex);
  const itemsRef = useRef(items);
  const lastEmittedValue = useRef<number>(value);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    indexRef.current = centeredIndex;
  }, [centeredIndex]);

  // Sync scroll position when external value changes
  useEffect(() => {
    const idx = indexForValue(value);

    // Guard: Don't interrupt if we are already at this index or if we just sent this value
    if (idx === indexRef.current || value === lastEmittedValue.current) {
      return;
    }

    setCenteredIndex(idx);
    indexRef.current = idx;
    lastEmittedValue.current = value;

    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: false });
    }, 50);
    return () => clearTimeout(timer);
  }, [value, indexForValue]);

  const scrollToIndex = useCallback((index: number, animated = true) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT)),
      );
      if (idx !== indexRef.current) {
        setCenteredIndex(idx);
        indexRef.current = idx;
        onChange(items[idx]);
      }
    },
    [items],
  );

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT)),
      );

      setCenteredIndex(idx);
      indexRef.current = idx;

      if (items[idx] !== lastEmittedValue.current) {
        lastEmittedValue.current = items[idx];
        onChange(items[idx]);
      }
    },
    [items, onChange],
  );

  const handleIncrement = useCallback(() => {
    const next = Math.min(items.length - 1, indexRef.current + 1);
    if (next !== indexRef.current) {
      lastEmittedValue.current = items[next];
      setCenteredIndex(next);
      indexRef.current = next;
      scrollToIndex(next);
      onChange(items[next]);
    }
  }, [items, scrollToIndex, onChange]);

  const handleDecrement = useCallback(() => {
    const prev = Math.max(0, indexRef.current - 1);
    if (prev !== indexRef.current) {
      lastEmittedValue.current = items[prev];
      setCenteredIndex(prev);
      indexRef.current = prev;
      scrollToIndex(prev);
      onChange(items[prev]);
    }
  }, [items, scrollToIndex, onChange]);

  return (
    <View>
      <View
        style={[
          styles.container,
          error ? styles.containerError : styles.containerNormal,
        ]}
      >
        {/* Up / decrement button */}
        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          hitSlop={8}
        >
          <ChevronUp size={22} color="#6b7280" />
        </Pressable>

        {/* Picker window */}
        <View style={styles.window}>
          {/* Center highlight bar */}
          <View style={styles.selectionBar} pointerEvents="none" />

          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * SIDE_ITEMS,
            }}
            showsVerticalScrollIndicator={false}
            snapToOffsets={items.map((_, i) => i * ITEM_HEIGHT)}
            snapToAlignment="center"
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            bounces={false}
            overScrollMode="never"
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {items.map((item, index) => {
              const distance = Math.abs(index - centeredIndex);
              return (
                <View key={item} style={styles.item}>
                  <Text
                    style={[
                      styles.itemText,
                      distance === 0 && styles.itemTextActive,
                      distance === 1 && styles.itemTextNear,
                      distance >= 2 && styles.itemTextFar,
                    ]}
                  >
                    {format(item)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Down / increment button */}
        <Pressable
          onPress={handleIncrement}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          hitSlop={8}
        >
          <ChevronDown size={22} color="#6b7280" />
        </Pressable>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.stepLabel}>±{format(step)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  containerNormal: {
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  containerError: {
    borderColor: "#fca5a5",
    backgroundColor: "#fff5f5",
  },
  btn: {
    width: 48,
    height: CONTAINER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    backgroundColor: "#f3f4f6",
  },
  window: {
    flex: 1,
    height: CONTAINER_HEIGHT,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
  selectionBar: {
    position: "absolute",
    left: 12,
    right: 12,
    top: ITEM_HEIGHT * SIDE_ITEMS,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d5db",
    zIndex: 1,
    pointerEvents: "none",
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#d1d5db",
  },
  itemTextActive: {
    fontSize: 26,
    fontWeight: "600",
    color: "#111827",
  },
  itemTextNear: {
    fontSize: 20,
    fontWeight: "400",
    color: "#6b7280",
  },
  itemTextFar: {
    fontSize: 16,
    fontWeight: "400",
    color: "#d1d5db",
  },
  error: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
  },
  stepLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 6,
    marginLeft: 4,
  },
});
