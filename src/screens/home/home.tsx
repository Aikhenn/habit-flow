import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import COLORS from "../../constants/colors";
import HomeHeader from "./header";
import TaskCard from "./taskCard";
import ProgressBar from "../../components/progressBar";
import Chip from "../../components/chip";
import {  useRef, useState } from "react";
import hexToRgba from "../../utils/hexConverter";
import { CATEGORIES } from "../../constants/constant";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddTask
 from "./addTask";
const taskData = [
    {id: 1, title: "take out trash", dueAt: "2026-08-14T18:30:00",category: 'Work', isChecked: false},
    {id: 2, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Study',isChecked: false},
    {id: 3, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Study',isChecked: false},
    {id: 4, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Work',isChecked: false},
    {id: 5, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Personal',isChecked: false},
    {id: 6, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Personal',isChecked: false},
    {id: 7, title: "clean room",  dueAt: "2026-10-04T18:30:00", category: 'Health',isChecked: false},
]

function HomeScreen() {
    const [tasks, setTasks] = useState(taskData);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const toggleTask = (id: number) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === id 
                ? {...task, isChecked: !task.isChecked}
                : task
        ));
    }

    const renderTask = ({item}: {item: typeof taskData[number]})=> (
        <TaskCard
            task={item}
            onPress={() => toggleTask(item.id)}
        />
    )

    const isSameDate = (dueAt: string, date: Date) => {
        const dateString = `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        return dueAt.split("T")[0] === dateString;
    };

    const isAllSelected = selectedCategory === 0;
    const selectedCategoryName = CATEGORIES.find((category) => category.id === selectedCategory)?.name

    const filteredTask = tasks.filter((task) => 
            isSameDate(task.dueAt, selectedDate) &&
            //if all selected show all otherwise match by category
            (isAllSelected || task.category === selectedCategoryName  )
            )

    const completedTask = tasks.filter((task) => task.isChecked === true).length
    const currentProgress = completedTask / tasks.length * 100

    const openAddTask = () => {
        console.log("FAB PRESSED");
            console.log("REF:", bottomSheetRef.current);

        
    setTimeout(() => {
        bottomSheetRef.current?.present();
    }, 100);
    }

    return ( 
        <>
        <View style={styles.container}>
            <HomeHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
            <View style={styles.ProgressContainer}>
                <Text>{completedTask} / {tasks.length}</Text>
                <ProgressBar progress={currentProgress}/>
            </View>
            <View style={styles.chipList}>
                {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.id
                    
                    const bgColor = hexToRgba(category.color, isSelected ? 1 : 0.2);
                    const color = isSelected ? COLORS.WHITE : category.color;

                    return (
                        <Chip 
                            key={category.id}
                            title={category.name}
                            bgColor={bgColor}
                            color={color}
                            containerStyle={styles.chipSytle}
                            onPress={() => setSelectedCategory(category.id)}                        />  
                    )
                })}
            </View>
            <FlatList
                style={styles.taskList}
                data={filteredTask}
                renderItem={renderTask}
            />
                <Pressable style={styles.fab} onPress={openAddTask}>
                    <MaterialIcons name="add" size={48} color={COLORS.WHITE}/>
                </Pressable>
        </View>
            <AddTask ref={bottomSheetRef}/>
        </> 

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        padding: 16,
        width: '100%',
    },
    ProgressContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems:'center',
        gap: 6,
        paddingVertical: 12
    },
    chipList: {
        flexDirection: 'row',
        gap: 4,
        //backgroundColor: COLORS.LIGHT_GRAY

    },
    chipSytle:{
        marginBottom: 16,
    },
    taskList: {
        //backgroundColor: COLORS.primary
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 20,
        padding: 16,
        borderRadius: 100,
        boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.4)',
        backgroundColor: COLORS.primary
    }


});
export default HomeScreen;