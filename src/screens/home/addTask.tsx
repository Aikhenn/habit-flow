/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo,  useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import COLORS from "../../constants/colors";
import Chip from "../../components/chip";
import { CATEGORIES } from "../../constants/constant";
import hexToRgba from "../../utils/hexConverter";
import Octicons from "@react-native-vector-icons/octicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { addTask } from "../../database/database";
import SettingCard from "../../components/settingCard";
import CalendarModal from "../../components/calendarModal";
import { RepeatFrequency } from "./components/repeatTypes";
import RepeatSettingsSheet from "./components/repeatSettingsSheet";
interface AddTaskProps {
    onTaskSaved: () => void | Promise<void>;
}

const AddTask = forwardRef<BottomSheetModal, AddTaskProps>(({onTaskSaved }, ref) => {     
    const snapPoints = useMemo(() => ["75%"], []);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeEnabled, setTimeEnabled] =useState(false);
    const [repeatEnabled, setRepeatEnabled] = useState(false);
    const [dailyRepeat, setDailyRepeat] =useState(0);
    const [weeklyRepeat, setWeeklyRepeat] =useState(0);
    const [monthlyRepeat, setMonthlyRepeat] =useState(0);
    const [taskName, setTaskName] = useState('');
    const [selectedTime, setSelectedTime] = useState("08:00 AM");
    const filteredCategories = CATEGORIES.filter((category) => category.id !== 0 )

    const [calendarVisible, setCalendarVisible] = useState(false);
    const [repeatFrequency, setRepeatFrequency] = useState<RepeatFrequency>("none");
    const [repeatPageVisible, setRepeatPageVisible] = useState(false);

    const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);

    const handleAddPress =  async () => {

        console.log('taskname ', taskName);
        const title = taskName.trim();

        if (!title) {
            console.warn('Please enter a task name.');
            return;
        }

        if (selectedCategory === 0) {
            console.warn('Please select a category.');
            return;
        }

        try {
            await addTask({
                title: title, 
                category_id: selectedCategory,
                date: selectedDate.toISOString(),
                scheduled_time: timeEnabled ? new Date().toISOString() : null,
                repeat_daily: dailyRepeat,
                repeat_weekly: weeklyRepeat,
                repeat_monthly: monthlyRepeat,
            });
            console.log('Task added successfully!');
            // Notify HomeScreen that the task was saved
            await onTaskSaved();

            // Reset the form
            setTaskName("");
            setSelectedCategory(0);
            setTimeEnabled(false);
            setDailyRepeat(0);
            setWeeklyRepeat(0);
            setMonthlyRepeat(0);
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    }

    return ( 
        <BottomSheetModal 
            ref={ref} 
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.5}  
                />
            )}
            backgroundStyle={{
                backgroundColor: COLORS.WHITE,
                borderRadius: 30,
                boxShadow: '3px 0px 20px rgba(0,0,0, 0.2)'
            }}
        >
            <View style={styles.sheetContent}>
            <View style={styles.mainPage}>
                <Text style={styles.textHeading}>New Task</Text>
                <Text style={styles.subText}>TASK</Text>
                <TextInput
                    style={styles.input}
                    placeholder="what needs to be done?"
                    value={taskName}
                    onChangeText={(name) => setTaskName(name)}
                />
                <Text style={styles.subText}>CATEGORY</Text>
                <View style={styles.chipList}> 
                    {filteredCategories.map((category) => {            
                        const isSelected = selectedCategory === category.id     
                        const bgColor = hexToRgba(category.color, isSelected ? 1 : 0.2);
                        const color = isSelected ? COLORS.WHITE : category.color;
              
                        return(
                            <Chip 
                                key={category.id}
                                title={category.name}
                                bgColor={bgColor}
                                color={color}
                                onPress={() => setSelectedCategory(category.id)}         
                                //containerStyle={styles.chipSytle}
                                
                            />
                        )
                    })}
                </View>

                {/**Date UI */}
                <Text style={styles.inputTitle}>Date</Text>
                <SettingCard
                    value={timeEnabled}
                    setValue={setTimeEnabled}
                    icon={<Octicons name="calendar" size={18} color="rgba(0, 0, 0, 0.5)"/>}
                    title={selectedDate.toDateString()}
                    isPressable={true}
                    onPress={() => setCalendarVisible(true)}
                />

                <CalendarModal
                    visible={calendarVisible}
                    selectedDate={selectedDate}
                    onClose={() => setCalendarVisible(false)}
                    onConfirm={setSelectedDate}
                />

                {/**Time UI */}
                <Text style={styles.inputTitle}>Time</Text>
                <SettingCard
                    value={timeEnabled}
                    setValue={setTimeEnabled}
                    icon={<Octicons name="clock" size={18} color="rgba(0, 0, 0, 0.5)"/>}
                    title="Set Time"
                    subText={timeEnabled ? "Time is set" : "No time set"}
                />
                {timeEnabled && (
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 08:30 AM"
                        value={selectedTime}
                        onChangeText={setSelectedTime}
                        keyboardType="numbers-and-punctuation"
                        maxLength={8}
                        autoCapitalize="characters"
                    />
                )}
                                

                {/**Repeat UI */}
                <Text style={styles.inputTitle}>Repeat</Text>

                <SettingCard
                    value={repeatFrequency !== "none"}
                    setValue={() => {}}
                    icon={<MaterialIcons name="repeat" size={18} color="rgba(0, 0, 0, 0.5)" />}
                    title="Repeat"
                    subText={
                        repeatFrequency === "none"
                            ? "Does not repeat"
                            : `Repeats ${repeatFrequency}`
                    }
                    isPressable
                    onPress={() => setRepeatPageVisible(true)}
                />

                <Pressable style={styles.button} onPress={handleAddPress} >
                    <Text style={styles.buttonText}>Add Task</Text>
                </Pressable>


            </View>

            <RepeatSettingsSheet
                visible={repeatPageVisible}
                frequency={repeatFrequency}
                selectedDate={selectedDate}
                selectedWeekdays={selectedWeekdays}
                repeatEnabled={repeatEnabled}
                setRepeatEnabled={setRepeatEnabled}
                onFrequencyChange={setRepeatFrequency}
                onWeekdaysChange={setSelectedWeekdays}
                onDatePress={() => setCalendarVisible(true)}
                onClose={() => setRepeatPageVisible(false)}
            />
            </View>
        </BottomSheetModal>
     );
});

export default AddTask;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'space-between'
    },

    sheetContent: {
    flex: 1,
    position: "relative",
    },

    mainPage: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: "space-between",
    },
    textHeading: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 10
    },
    inputTitle: { 
        fontSize: 12,
        opacity: 0.4,
        fontWeight: 'bold',
        paddingVertical: 8,
    },
    subText: {
        fontSize: 12,
        opacity: 0.4,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        padding: 16,
        borderWidth: 0.2,
        borderRadius: 16,
        gap: 10,
        marginVertical: 6,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    chipList: {
        flexDirection: 'row',
        gap: 4,
        //backgroundColor: COLORS.LIGHT_GRAY

    },
    switch: {
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding:12,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontWeight: 'bold'

    }

})