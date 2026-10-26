import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Octicons from "@react-native-vector-icons/octicons";
import COLORS from "../../../constants/colors";
import SettingCard from "../../../components/settingCard";
import type { RepeatFrequency } from "./repeatTypes";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import MonthlyDatePickerModal from "../../../components/monthlyDatePickerModal";

interface RepeatSettingsSheetProps {
    visible: boolean;
    frequency: RepeatFrequency;
    selectedDate: Date;
    selectedWeekdays: number[];
    repeatEnabled: boolean;
    setRepeatEnabled: (enabled: boolean) => void;
    onFrequencyChange: (frequency: RepeatFrequency) => void;
    onWeekdaysChange: (days: number[]) => void;
    onDatePress: () => void;
    onClose: () => void;
}

const WEEKDAYS = [
    { label: "M", name: "Monday", value: 1 },
    { label: "T", name: "Tuesday", value: 2 },
    { label: "W", name: "Wednesday", value: 3 },
    { label: "T", name: "Thursday", value: 4 },
    { label: "F", name: "Friday", value: 5 },
    { label: "S", name: "Saturday", value: 6 },
    { label: "S", name: "Sunday", value: 0 },
];
const FREQUENCIES: RepeatFrequency[] = [
    "daily",
    "weekly",
    "monthly",
];

export default function RepeatSettingsSheet({
    visible,
    frequency,
    selectedDate,
    selectedWeekdays,
    repeatEnabled,
    setRepeatEnabled,
    onFrequencyChange,
    onWeekdaysChange,  
    onClose,
}: RepeatSettingsSheetProps) {
    const [monthlyDay, setMonthlyDay] = useState(1);
    const [monthlyPickerVisible, setMonthlyPickerVisible] = useState(false);
    const translateX = useRef(new Animated.Value(400)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(translateX, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            translateX.setValue(400);
        }
    }, [visible, translateX]);

    const toggleWeekday = (day: number) => {
            onWeekdaysChange(
                selectedWeekdays.includes(day)
                    ? selectedWeekdays.filter((value) => value !== day)
                    : [...selectedWeekdays, day],
            );
        };


    if (!visible) {
        return null;
    }

    const handleRepeatToggle = (enabled: boolean) => {
        setRepeatEnabled(enabled);
        onFrequencyChange("daily");
        if (!enabled) {
            onFrequencyChange("none");
        }
    }

   return (
    <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={[ styles.container, { transform: [{ translateX }], }, ]}
    >
        {/* Back button */}
        <Pressable onPress={onClose} style={styles.header}>
            <Octicons
                name="arrow-left"
                size={22}
                color={COLORS.primary}
            />
            <Text style={styles.heading}>Repeat Task</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>REPEAT FREQUENCY</Text>

        <SettingCard
            value={repeatEnabled}
            setValue={handleRepeatToggle}
            icon={<MaterialIcons name="repeat" size={18} color="rgba(0, 0, 0, 0.5)" />}
            title="Repeat"
            subText={`Repeats ${frequency}`}
        
        />

        {FREQUENCIES.map((item) => {
            const selected = frequency === item;

            if (!repeatEnabled){
                return null;
            }

            return (
                <Pressable
                    key={item}
                    style={[
                        styles.option,
                        selected && styles.selectedOption,
                    ]}
                    onPress={() => onFrequencyChange(item)}
                >
                    <Text style={styles.optionText}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>

                    {selected && (
                        <Octicons
                            name="check-circle-fill"
                            size={18}
                            color={COLORS.primary}
                        />
                    )}
                </Pressable>
            );
        })}

        {/* WEEKLY: select weekdays */}
            {frequency === "weekly" && (
                <View>
                    <Text style={styles.sectionTitle}>
                        REPEAT ON
                    </Text>

                    <View style={styles.weekdayContainer}>
                        {WEEKDAYS.map((day) => {
                            const selected =
                                selectedWeekdays.includes(day.value);

                            return (
                                <Pressable
                                    key={day.name}
                                    accessibilityRole="checkbox"
                                    accessibilityLabel={day.name}
                                    accessibilityState={{
                                        checked: selected,
                                    }}
                                    onPress={() =>
                                        toggleWeekday(day.value)
                                    }
                                    style={[
                                        styles.weekdayButton,
                                        selected &&
                                            styles.weekdayButtonSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.weekdayText,
                                            selected &&
                                                styles.weekdayTextSelected,
                                        ]}
                                    >
                                        {day.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.helperText}>
                        {selectedWeekdays.length === 0
                            ? "Select at least one day"
                            : `Repeats every ${selectedWeekdays
                                .slice()
                                .sort((a, b) => {
                                    const order = [1, 2, 3, 4, 5, 6, 0];
                                    return order.indexOf(a) -
                                        order.indexOf(b);
                                })
                                .map((day) =>
                                    WEEKDAYS.find(
                                        (item) => item.value === day,
                                    )?.name,
                                )
                                .join(", ")}`}
                    </Text>
                </View>
            )}

            {/* MONTHLY: select a calendar date */}
            {frequency === "monthly" && (
                <View>
                    <Text style={styles.sectionTitle}>
                        REPEAT ON DATE
                    </Text>

                    <SettingCard
                        value={false}
                        setValue={() => {}}
                        icon={
                            <Octicons
                                name="calendar"
                                size={18}
                                color="rgba(0, 0, 0, 0.5)"
                            />
                        }
                        title={selectedDate.toLocaleDateString(
                            undefined,
                            {
                                month: "long",
                                day: "numeric",
                            },
                        )}
                        subText="Choose the day of the month"
                        isPressable
                        onPress={() => setMonthlyPickerVisible(true)}
                    />
                    <MonthlyDatePickerModal
                        visible={monthlyPickerVisible}
                        selectedDay={monthlyDay}
                        onClose={() => setMonthlyPickerVisible(false)}
                        onConfirm={(day) => {
                            setMonthlyDay(day);
                            setMonthlyPickerVisible(false);
                        }}
                    />
                </View>
            )}

        <View style={styles.footer}>
            <Pressable style={styles.doneButton} onPress={onClose}>
                <Text style={styles.doneText}>Done</Text>
            </Pressable>
        </View>
    </Animated.View>
);
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        zIndex: 10,
        elevation: 10,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.BLACK,
    },
    sectionTitle: {
        fontSize: 12,
        opacity: 0.5,
        fontWeight: "bold",
        marginVertical: 10,
    },
    option: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginVertical: 4,
        borderRadius: 14,
        backgroundColor: COLORS.secondary,
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    optionText: {
        fontSize: 15,
        color: COLORS.BLACK,
    },
    selectedText: {
        color: COLORS.primary,
        fontWeight: "bold",
    },
    weekdayContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 6,
        marginVertical: 8,
    },
    weekdayButton: {
        flex: 1,
        aspectRatio: 1,
        maxHeight: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.secondary,
    },
    weekdayButtonSelected: {
        backgroundColor: COLORS.primary,
    },
    weekdayText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.BLACK,
    },
    weekdayTextSelected: {
        color: COLORS.WHITE,
    },
    helperText: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 8,
    },
    footer: {
        marginTop: "auto",
        gap: 12,
        alignItems: "center",
    },
    doneButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 12,
        width: "100%",
        alignItems: "center",
    },
    doneText: {
        color: COLORS.WHITE,
        fontWeight: "bold",
    },
    clearText: {
        color: COLORS.primary,
        fontWeight: "600",
        padding: 8,
    },
});