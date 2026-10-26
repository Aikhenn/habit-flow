import { View,Text, StyleSheet, Pressable } from "react-native";
import COLORS from "../../constants/colors";
import { Octicons } from '@react-native-vector-icons/octicons/static';
import Chip from "../../components/chip";
import { CATEGORIES } from "../../constants/constant";
import hexToRgba from "../../utils/hexConverter";
import { memo } from "react";
import { Task } from "../../database/database";

interface taskCardProps {
    task: Task;
    onPress: () => void;

}


const TaskCard = ({task, onPress}: taskCardProps) => {

    const category = CATEGORIES.find(
        item => item.id === task.category_id
    );

    const categoryColor = category?.color ?? COLORS.BLACK;
    const isChecked = task.is_completed === 1;

    const time = task.created_at
            ? new Date(task.created_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
            })
            : "No time set";

    console.log('taskcard render')

    return (
        <View style={styles.taskContainer}>
            <View style={[styles.line, {backgroundColor: categoryColor  }]}/>
               <Pressable style={!isChecked && styles.unchecked} onPress={onPress} >
                    {isChecked ? (
                        <Octicons name="check-circle-fill" size={26} color={categoryColor}/>
                    ): (
                        <Octicons name="circle" size={26}/>
                    )}
                </Pressable>

            <View style={styles.textContainer}>
                <Text style={isChecked ? styles.titleChecked : styles.title}>{task.title}</Text>
                <View style={styles.bottomText}>
                    <Chip 
                        title={category?.name || "Unknown Category"} 
                        bgColor={hexToRgba( categoryColor, 0.2)}
                        color={categoryColor}
                        containerStyle={styles.chipStyle}
                        textStyle={styles.chipTextStyle}
                    />
                    <Octicons name="clock" size={12} color="rgba(0, 0, 0, 0.5)"/>
                    <Text style={styles.subText}>{time}</Text>
                </View>
            </View>
        </View>
    )
}

export default memo(TaskCard);


const styles = StyleSheet.create({
    taskContainer: {
        backgroundColor: COLORS.WHITE,
        marginVertical: 4,
        padding: 20,
        gap: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.10)',
    },
    line: {
        height: '100%',
        width: 5,
        borderRadius: 20,
    },
    textContainer: {
        gap: 4,

    },
    bottomText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleChecked: {
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'line-through',
        opacity: 0.4
    },
    subText: {
        fontSize: 12,
        opacity: 0.7
    },
    unchecked: {
        opacity: 0.3
    },
    chipStyle: {
        paddingVertical: 3,
        paddingHorizontal: 14,
        borderRadius: 40,
    
    },
    chipTextStyle: {

        fontSize: 12
    }
});