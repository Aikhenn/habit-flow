import { StyleSheet,Text, View, Pressable } from "react-native"; 
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import COLORS from "../../constants/colors";
import CalendarCarousel from "./carousel";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

interface Day {
    day: string;
    date: number;
    fullDate: Date;
}

interface HomeHeaderProps {
    selectedDate: Date,
    setSelectedDate: Dispatch<SetStateAction<Date>>;
}


function HomeHeader({selectedDate, setSelectedDate} :HomeHeaderProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextWeek = () => {
        setCurrentDate(prev => {
            const date = new Date(prev);
            date.setDate(date.getDate() + 7);
            return date;
        })
    }

    const previousWeek  = () => {
        setCurrentDate(prev => {
            const date = new Date(prev);
            date.setDate(date.getDate() - 7);
            return date;
        })
    }

    const onDayPress = useCallback((item: Day) => {
        setSelectedDate(item.fullDate)
    },[setSelectedDate])

    return ( 
        <View style={styles.container}>
          
            <View>
                <View style={styles.topContainer}>
                    <View>
                        <Text style={styles.subText}>
                            {currentDate.toLocaleDateString('en-US', {
                                month:'short',
                                year: 'numeric'
                            })}
                        </Text> 
                        <Text style={styles.Title}>Today</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                        <Pressable 
                            onPress={nextWeek}
                            style={({ pressed}) => [
                                styles.arrowButton,
                                pressed && styles.arrowButtonPressed
                            ]}
                        >
                            <MaterialIcons name="arrow-back-ios-new" size={20}/>
                        </Pressable>
                        <Pressable 
                            onPress={previousWeek}
                            style={({ pressed}) => [
                                styles.arrowButton,
                                pressed && styles.arrowButtonPressed
                            ]}
                        >
                            <MaterialIcons name="arrow-forward-ios" size={20}/>
                        </Pressable>
                    </View>
                  
                   
                </View> 
                <CalendarCarousel 
                    currentDate={currentDate} 
                    selectedDate={selectedDate}
                    onPress={onDayPress}/>
            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        //backgroundColor: COLORS.primary
    },
    topContainer: {
        //backgroundColor: COLORS.primary,
         justifyContent: 'space-between',
         flexDirection: 'row',
         alignItems: 'center',
         paddingVertical: 10,
    },
    arrowContainer: {
        flexDirection: 'row',
        gap: 4
    },
    arrowButton: {
        backgroundColor: COLORS.LIGHT_GRAY,
        padding: 12,
        justifyContent: 'center',
        borderRadius: 100,
        
    },
    arrowButtonPressed: {
        opacity: 0.7,
    },
    Title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: 16,
    },
})

export default HomeHeader;