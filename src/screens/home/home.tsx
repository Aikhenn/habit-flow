import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import COLORS from "../../constants/colors";
import HomeHeader from "./header";
import TaskCard from "./taskCard";
import ProgressBar from "../../components/progressBar";
import Chip from "../../components/chip";
import {  useEffect, useRef, useState } from "react";
import hexToRgba from "../../utils/hexConverter";
import { CATEGORIES } from "../../constants/constant";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddTask from "./addTask";
import { getTasks, updateTaskCompletion, type Task } from "../../database/database";
import { handleResetDatabase } from "../../utils/resetDatabase";
import { formatDate } from "../../utils/dateFormatter";

function HomeScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const loadTasks = async () => {
        try{
            const savedTasks = await getTasks(formatDate(selectedDate));
            setTasks(savedTasks);
            console.log('Loaded tasks:', savedTasks);

        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
                setIsLoading(false);
            }
    }


    const toggleTask = async (id: number) => {
        const task = tasks.find(item => item.id === id);
        if (!task) return;
        //checks current status of the task and sets the next status
        const nextCompleted = task.is_completed === 0;

        try {
            await updateTaskCompletion(id, nextCompleted);

            setTasks(prevTasks =>
                prevTasks.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            is_completed: nextCompleted ? 1 : 0,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


    const renderTask = ({item}: {item: Task})=> (
        <TaskCard
            task={item}
            onPress={() => toggleTask(item.id)}
        />
    )

    const isAllSelected = selectedCategory === 0;

    const filteredTask = tasks.filter((task) => {
        const matchesCategory =  isAllSelected || task.category_id === selectedCategory;
        return matchesCategory ;
    });

    const completedTask = tasks.filter((task) => task.is_completed === 1).length
    const currentProgress = completedTask / tasks.length * 100

    const openAddTask = () => {
        bottomSheetRef.current?.present();
    }

    const handleTaskSaved = async () => {
        await loadTasks();
        bottomSheetRef.current?.dismiss();
    };
        
    useEffect(() => {
        loadTasks();
    }, [selectedDate]);

    return ( 
        <>
        <View style={styles.container}>
            <HomeHeader 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                loadTask={loadTasks}
            />
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
            {/* Developer Button */}
            {__DEV__ && (
                <Pressable
                    style={styles.devFab}
                    onPress={handleResetDatabase}
                >
                    <MaterialIcons
                        name="bug-report"
                        size={24}
                        color={COLORS.WHITE}
                    />
                </Pressable>
            )}

            {/* Add Task Button */}
            <Pressable style={styles.fab} onPress={openAddTask}>
                <MaterialIcons
                    name="add"
                    size={48}
                    color={COLORS.WHITE}
                />
            </Pressable>
                <Pressable style={styles.fab} onPress={openAddTask}>
                    <MaterialIcons name="add" size={48} color={COLORS.WHITE}/>
                </Pressable>
        </View>
            <AddTask ref={bottomSheetRef} onTaskSaved={handleTaskSaved}/>
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
    },
    devFab: {
    position: "absolute",
    right: 32,
    bottom: 115,
    padding: 12,
    borderRadius: 100,
    backgroundColor: "#555555",
    elevation: 5,
},


});
export default HomeScreen;