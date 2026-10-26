import { Pressable, StyleSheet, Text, View } from "react-native";
import COLORS from "../constants/colors";
import type { ReactNode } from "react";
import CustomSwitch from "./customSwitch";
import MaterialIcons from "@react-native-vector-icons/material-icons";

interface SettingCardProps {
    value: boolean;
    setValue: (value: boolean) => void;
    icon: ReactNode;
    title: string;
    subText?: string;
    isPressable?: boolean;
    onPress?: () => void;
}

function SettingCard({
    value,
    setValue,
    icon,
    title,
    subText,
    isPressable = false,
    onPress,
}: SettingCardProps) {
    const content = (
        <>
            {icon}
            <View style={{ flex: 1 }}>
                <Text>{title}</Text>
                {subText && <Text style={styles.subText}>{subText}</Text>}
            </View>

            {isPressable ? (
                <MaterialIcons name="arrow-forward-ios" size={18}  color="rgba(0, 0, 0, 0.3)"/>
            ): (
                 <CustomSwitch
                    value={value}
                    onValueChange={setValue}
                />
            )}
        </>
    );

    return isPressable ? (
        <Pressable
            style={styles.input}
            onPress={onPress}
        >
            {content}
        </Pressable>
    ) : (
        <View style={styles.input}>
            {content}
        </View>
    );
}

export default SettingCard;

const styles = StyleSheet.create({
    subText: {
        fontSize: 12,
        opacity: 0.4,
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: COLORS.secondary,
        padding: 16,
        borderWidth: 0.2,
        borderRadius: 16,
        gap: 10,
        marginVertical: 6,
        alignItems: "center",
        justifyContent: "space-between",
    },
});