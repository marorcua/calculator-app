import { formatCurrency } from "@/domain/math/math";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";

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
const VISIBLE_ITEMS = 5;
const SIDE_ITEMS = Math.floor(VISIBLE_ITEMS / 2);
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const RouletteItem = ({
  item,
  index,
  scrollY,
  format,
}: {
  item: number;
  index: number;
  scrollY: Animated.SharedValue<number>;
  format: (v: number) => string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const itemPosition = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - itemPosition);

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1.5, 1.0, 0.8],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.6, 0.3],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <Text style={styles.itemTextBase}>{format(item)}</Text>
    </Animated.View>
  );
};

export const NumberRoulette = ({
  value,
  onChange,
  min = 0,
  max = 500000,
  step = 10000,
  format = (v) => formatCurrency(v),
  error,
}: NumberRouletteProps) => {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);

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

  const indexRef = useRef(centeredIndex);
  const lastEmittedValue = useRef<number>(value);
  const debouncedEmit = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    indexRef.current = centeredIndex;
  }, [centeredIndex]);

  useEffect(() => {
    return () => {
      if (debouncedEmit.current) clearTimeout(debouncedEmit.current);
    };
  }, []);

  useEffect(() => {
    const idx = indexForValue(value);

    if (idx === indexRef.current || value === lastEmittedValue.current) {
      return;
    }

    setCenteredIndex(idx);
    indexRef.current = idx;
    lastEmittedValue.current = value;

    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: false });
      scrollY.value = idx * ITEM_HEIGHT;
    }, 50);
    return () => clearTimeout(timer);
  }, [value, indexForValue, scrollY]);

  const scrollToIndex = useCallback((index: number, animated = true) => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
  }, []);

  const emitChange = useCallback(
    (index: number) => {
      const val = items[index];
      if (val !== undefined && val !== lastEmittedValue.current) {
        lastEmittedValue.current = val;
        onChange(val);
      }
    },
    [items, onChange],
  );

  const debouncedUpdate = useCallback(
    (offsetY: number) => {
      if (debouncedEmit.current) clearTimeout(debouncedEmit.current);
      debouncedEmit.current = setTimeout(() => {
        const idx = Math.max(
          0,
          Math.min(items.length - 1, Math.round(offsetY / ITEM_HEIGHT)),
        );
        setCenteredIndex(idx);
        indexRef.current = idx;
        emitChange(idx);
      }, 150);
    },
    [items, emitChange],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(debouncedUpdate)(event.contentOffset.y);
    },
    onMomentumEnd: (event) => {
      const idx = Math.max(
        0,
        Math.min(
          items.length - 1,
          Math.round(event.contentOffset.y / ITEM_HEIGHT),
        ),
      );
      runOnJS(setCenteredIndex)(idx);
      runOnJS(emitChange)(idx);
    },
    onEndDrag: (event) => {
      const idx = Math.max(
        0,
        Math.min(
          items.length - 1,
          Math.round(event.contentOffset.y / ITEM_HEIGHT),
        ),
      );
      runOnJS(setCenteredIndex)(idx);
      runOnJS(emitChange)(idx);
    },
  });

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
        <Pressable
          onPress={handleDecrement}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          hitSlop={8}
        >
          <ChevronUp size={22} color="#6b7280" />
        </Pressable>

        <View style={styles.window}>
          <View style={styles.selectionBar} pointerEvents="none" />

          <Animated.ScrollView
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
            onScroll={onScroll}
            bounces={false}
            overScrollMode="never"
            nestedScrollEnabled={true}
          >
            {items.map((item, index) => (
              <RouletteItem
                key={item}
                item={item}
                index={index}
                scrollY={scrollY}
                format={format}
              />
            ))}
          </Animated.ScrollView>
        </View>

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
  itemTextBase: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
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
