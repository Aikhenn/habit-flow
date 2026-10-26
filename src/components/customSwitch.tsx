import { useEffect, useRef } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
} from "react-native";
import COLORS from "../constants/colors";

interface CustomSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const TRACK_PADDING = 4;
const THUMB_SIZE = 18;

const MAX_TRANSLATE_X =
    TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

export default function CustomSwitch({
    value,
    onValueChange,
}: CustomSwitchProps) {
    const translateX = useRef(
        new Animated.Value(value ? MAX_TRANSLATE_X : 0)
    ).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: value ? MAX_TRANSLATE_X : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [value, translateX]);

    return (
        <Pressable
            onPress={() => onValueChange(!value)}
            accessibilityRole="switch"
            accessibilityState={{ checked: value }}
            style={[
                styles.track,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    backgroundColor: value
                        ? COLORS.primary
                        : "#D1D5DB",
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    track: {
        width: TRACK_WIDTH,
        height: TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT / 2,
        padding: TRACK_PADDING,
        justifyContent: "center",
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: "#FFFFFF",
    },
});