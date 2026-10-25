import { StyleSheet,Text, View, FlatList, Dimensions, Pressable } from "react-native"; 
import GetWeek from "../../utils/getWeek";
import COLORS from "../../constants/colors";
import { memo } from "react";


const screenWidth = Dimensions.get("window").width;
const dayWidth = (screenWidth - 32) / 7;

interface Day {
    day: string;
    date: number;
    fullDate: Date;
}

interface DayCardProps {
    item: Day;
    currentDate: Date;
    selectedDate: Date;
    onPress: () => void;

}

const DayCard = memo(({ item, currentDate, selectedDate, onPress }: DayCardProps) => {
    const isToday = 
        item.fullDate.toLocaleDateString("en-US") === 
        currentDate.toLocaleDateString("en-US");
        
    const isDateSelected = 
        item.fullDate.toLocaleDateString("en-US") === 
        selectedDate.toLocaleDateString("en-US");


    return(
        <Pressable onPress={onPress} style={[styles.cardContainer, isDateSelected && styles.selectedCard]}>
            <Text style={[styles.dayText, isDateSelected && {color: COLORS.WHITE}]}>{item.day}</Text>
            <Text style={[styles.numberText, isDateSelected && {color: COLORS.WHITE}]}>{item.date}</Text> 
            <View style={[styles.indicator, isToday && {backgroundColor: COLORS.WHITE}]}/>
        </Pressable>
    )
})

interface CalendarCarouselProps {
    currentDate : Date, 
    selectedDate: Date,
    onPress: (item: Day) => void;
}


function CalendarCarousel({currentDate, selectedDate, onPress} : CalendarCarouselProps) {
    const week = GetWeek(currentDate)
    const today = new Date();

    console.log('rendering')

    return ( 
        <>
            <FlatList
                data={week}
                horizontal
                renderItem={({ item }) => (
                    <DayCard 
                        item={item} 
                        currentDate={today} 
                        selectedDate={selectedDate}
                        onPress={() => onPress(item)}/>

                )} 
            /> 
        </>
     );
}

export default CalendarCarousel;

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        paddingVertical: 10,
        width: dayWidth,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
        //backgroundColor: '#EB6A6A'
    },
    selectedCard: {
        borderRadius: 20,
        backgroundColor: COLORS.primary,
    },
    dayText: {
        opacity: 0.7,
        
    },
    numberText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    indicator: {
        height: 6,
        width: 6,
        marginTop: 3,
        borderRadius: 100,
    }


})