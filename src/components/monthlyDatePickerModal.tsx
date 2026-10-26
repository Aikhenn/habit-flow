import { useState } from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";
import Octicons from "@react-native-vector-icons/octicons";
import COLORS from "../constants/colors";

interface MonthlyDatePickerModalProps {
    visible: boolean;
    selectedDay: number;
    onClose: () => void;
    onConfirm: (day: number) => void;
}

export default function MonthlyDatePickerModal({
    visible,
    selectedDay,
    onClose,
    onConfirm,
}: MonthlyDatePickerModalProps) {
    const [day, setDay] = useState(selectedDay);

    const handleConfirm = () => {
        onConfirm(day);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Repeat Monthly
                        </Text>

                        <Pressable onPress={onClose}>
                            <Octicons
                                name="x"
                                size={22}
                                color={COLORS.BLACK}
                            />
                        </Pressable>
                    </View>

                    <Text style={styles.subtitle}>
                        Select a day to repeat every month
                    </Text>

                    <View style={styles.daysContainer}>
                        {Array.from(
                            { length: 31 },
                            (_, index) => index + 1,
                        ).map((item) => {
                            const selected = day === item;

                            return (
                                <Pressable
                                    key={item}
                                    onPress={() => setDay(item)}
                                    style={[
                                        styles.dayButton,
                                        selected &&
                                            styles.selectedDay,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            selected &&
                                                styles.selectedDayText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.helperText}>
                        Repeats on day {day} of every month
                    </Text>

                    <Pressable
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmText}>
                            Confirm
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        padding: 24,
    },
    modal: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.BLACK,
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 20,
        fontSize: 13,
        color: COLORS.BLACK,
        opacity: 0.6,
    },
    daysContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: 8,
    },
    dayButton: {
        width: "12%",
        aspectRatio: 1,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.secondary,
    },
    selectedDay: {
        backgroundColor: COLORS.primary,
    },
    dayText: {
        fontSize: 14,
        color: COLORS.BLACK,
    },
    selectedDayText: {
        color: COLORS.WHITE,
        fontWeight: "bold",
    },
    helperText: {
        marginTop: 18,
        fontSize: 13,
        color: COLORS.BLACK,
        opacity: 0.7,
    },
    confirmButton: {
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: COLORS.primary,
    },
    confirmText: {
        color: COLORS.WHITE,
        fontWeight: "bold",
    },
});