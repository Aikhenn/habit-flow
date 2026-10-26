import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
} from "react-native";
import Octicons from "@react-native-vector-icons/octicons";
import COLORS from "../constants/colors";

interface CalendarModalProps {
    visible: boolean;
    selectedDate: Date;
    onClose: () => void;
    onConfirm: (date: Date) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarModal({
    visible,
    selectedDate,
    onClose,
    onConfirm,
}: CalendarModalProps) {
    const [draftDate, setDraftDate] = useState(selectedDate);
    const [monthDate, setMonthDate] = useState(
        () =>
            new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1
            )
    );

    useEffect(() => {
        if (visible) {
            setDraftDate(selectedDate);
            setMonthDate(
                new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    1
                )
            );
        }
    }, [visible, selectedDate]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    while (days.length % 7 !== 0) {
        days.push(null);
    }

    const sameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const isCurrentMonth =
        year === today.getFullYear() &&
        month === today.getMonth();

    const changeMonth = (amount: number) => {
        setMonthDate(new Date(year, month + amount, 1));
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close calendar"
                />

                <View style={styles.modal}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>Select date</Text>
                            <Text style={styles.subtitle}>
                                Choose when your task is due
                            </Text>
                        </View>

                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                            style={styles.closeButton}
                            accessibilityRole="button"
                            accessibilityLabel="Close"
                        >
                            <Octicons
                                name="x"
                                size={20}
                                color={COLORS.BLACK}
                            />
                        </Pressable>
                    </View>

                    {/* Month navigation */}
                    <View style={styles.monthHeader}>
                        <Pressable
                            disabled={isCurrentMonth}
                            onPress={() => changeMonth(-1)}
                            style={styles.navButton}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel="Previous month"
                        >
                            <Octicons
                                name="chevron-left"
                                size={18}
                                color={
                                    isCurrentMonth
                                        ? "#CCCCCC"
                                        : COLORS.BLACK
                                }
                            />
                        </Pressable>

                        <Text style={styles.monthTitle}>
                            {monthDate.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                            })}
                        </Text>

                        <Pressable
                            onPress={() => changeMonth(1)}
                            style={styles.navButton}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel="Next month"
                        >
                            <Octicons
                                name="chevron-right"
                                size={18}
                                color={COLORS.BLACK}
                            />
                        </Pressable>
                    </View>

                    {/* Weekdays */}
                    <View style={styles.weekRow}>
                        {WEEKDAYS.map((day, index) => (
                            <Text
                                key={`${day}-${index}`}
                                style={styles.weekday}
                            >
                                {day}
                            </Text>
                        ))}
                    </View>

                    {/* Calendar grid */}
                    <View style={styles.calendar}>
                        {days.map((day, index) => {
                            if (day === null) {
                                return (
                                    <View
                                        key={`empty-${index}`}
                                        style={styles.dayCell}
                                    />
                                );
                            }

                            const date = new Date(year, month, day);
                            const isPast = date < today;
                            const isSelected = sameDay(date, draftDate);
                            const isToday = sameDay(date, today);

                            return (
                                <Pressable
                                    key={`${year}-${month}-${day}`}
                                    disabled={isPast}
                                    onPress={() => setDraftDate(date)}
                                    style={({ pressed }) => [
                                        styles.dayCell,
                                        pressed &&
                                            !isPast &&
                                            styles.pressedDay,
                                    ]}
                                    accessibilityRole="button"
                                    accessibilityLabel={date.toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                    accessibilityState={{
                                        selected: isSelected,
                                        disabled: isPast,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.dayCircle,
                                            isToday &&
                                                !isSelected &&
                                                styles.todayDay,
                                            isSelected &&
                                                styles.selectedDay,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                isPast &&
                                                    styles.disabledDay,
                                                isToday &&
                                                    !isSelected &&
                                                    styles.todayText,
                                                isSelected &&
                                                    styles.selectedDayText,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Pressable
                            onPress={() => {
                                setDraftDate(new Date(today));
                                setMonthDate(
                                    new Date(
                                        today.getFullYear(),
                                        today.getMonth(),
                                        1
                                    )
                                );
                            }}
                            style={styles.todayButton}
                        >
                            <Text style={styles.todayText}>Today</Text>
                        </Pressable>

                        <View style={styles.actions}>
                            <Pressable
                                onPress={onClose}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    onConfirm(draftDate);
                                    onClose();
                                }}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmText}>
                                    Confirm
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modal: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
        padding: 20,
        elevation: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    headerText: {
        flex: 1,
        gap: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.BLACK,
    },
    subtitle: {
        fontSize: 13,
        color: "#888888",
    },
    closeButton: {
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 17,
        backgroundColor: "#F3F3F3",
    },
    monthHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.BLACK,
    },
    navButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    weekRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekday: {
        width: "14.2857%",
        textAlign: "center",
        color: "#888888",
        fontSize: 12,
        fontWeight: "600",
    },

    calendar: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayCell: {
        width: "14.2857%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
    },
    dayCircle: {
        width: "86%",
        aspectRatio: 1,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    dayText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.BLACK,
    },
    disabledDay: {
        color: "#D3D3D3",
    },
    todayDay: {
        borderWidth: 1,
        borderColor: COLORS.RED,
    },
    todayText: {
        color: COLORS.RED,
        fontWeight: "700",
    },
    selectedDay: {
        backgroundColor: COLORS.RED,
    },
    selectedDayText: {
        color: COLORS.WHITE,
        fontWeight: "700",
    },
    pressedDay: {
        backgroundColor: "#FCE8E8",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
    },
    todayButton: {
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    cancelButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#F2F2F2",
    },
    cancelText: {
        color: COLORS.BLACK,
        fontWeight: "600",
    },
    confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: COLORS.RED,
    },
    confirmText: {
        color: COLORS.WHITE,
        fontWeight: "600",
    },
});