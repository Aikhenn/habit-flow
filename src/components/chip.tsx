import { Text, StyleSheet, StyleProp,ViewStyle, TextStyle, Pressable } from "react-native";
import COLORS from "../constants/colors";

interface ChipProps {
    title: string,
    bgColor: string,
    color: string,
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
}

function Chip({bgColor, color, title, containerStyle, textStyle, onPress}: ChipProps) {
    return ( 
        <Pressable onPress={onPress} style={[styles.container, {backgroundColor: bgColor}, containerStyle]}>
            <Text style={[styles.text, { color: color }, textStyle]}>{title}</Text>
        </Pressable>
     );
}

export default Chip;

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary
    },
    text: {
        color: COLORS.WHITE,
        fontWeight: 'bold'
    }
})