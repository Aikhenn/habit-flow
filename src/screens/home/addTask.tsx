/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo, useState } from "react";
import { View, Text, TextInput, StyleSheet, Switch,  Pressable } from "react-native";
import COLORS from "../../constants/colors";
import Chip from "../../components/chip";
import { CATEGORIES } from "../../constants/constant";
import hexToRgba from "../../utils/hexConverter";
import Octicons from "@react-native-vector-icons/octicons";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const AddTask = forwardRef<BottomSheetModal>((_, ref) => {    
    const snapPoints = useMemo(() => ["75%"], []);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [timeEnabled, setTimeEnabled] =useState(false);
    const [dailyEnabled, setDailyEnabled] =useState(false);
    const [weeklyEnabled, setWeeklyEnabled] =useState(false);
    const [taskName, setTaskName] = useState('');

    const filteredCategories = CATEGORIES.filter((category) => category.id !== 0 )

    const handleAddPress = () => {

        console.log('taskname ', taskName);
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
            <View style={styles.container}>
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
                {/**Time UI */}
                <Text style={styles.inputTitle}>Time</Text>
                <View style={styles.input}>
                    <Octicons name="clock" size={18} color="rgba(0, 0, 0, 0.5)"/>            
                    <View>
                        <Text>Set Time</Text>
                        <Text style={styles.subText}>No time set</Text>
                    </View>
                    <Switch
                        style={styles.switch} 
                        value={timeEnabled} 
                        onValueChange={setTimeEnabled}
                    />
                </View>

                {/**Repeat UI */}
                <Text style={styles.inputTitle}>Repeat</Text>
                <View style={styles.input}>
                    <MaterialIcons name="repeat" size={18} color="rgba(0, 0, 0, 0.5)"/>            
                    <View>
                        <Text>Daily</Text>
                        <Text style={styles.subText}>Repeat every day</Text>
                    </View>
                    <Switch
                        style={styles.switch} 
                        value={dailyEnabled} 
                        onValueChange={setDailyEnabled}
                    />
                </View>

                 <View style={styles.input}>
                    <MaterialIcons name="repeat" size={18} color="rgba(0, 0, 0, 0.5)"/>            
                    <View>
                        <Text>Weekly</Text>
                        <Text style={styles.subText}>Pick specific days</Text>
                    </View>

                    <Switch
                        style={styles.switch} 
                        value={weeklyEnabled} 
                        onValueChange={setWeeklyEnabled}
                    />                
                </View>

                <Pressable style={styles.button} onPress={handleAddPress} >
                    <Text style={styles.buttonText}>Add Task</Text>
                </Pressable>


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