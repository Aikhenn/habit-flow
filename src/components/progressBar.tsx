import { StyleSheet, View } from "react-native";
import COLORS from "../constants/colors";



function ProgressBar({progress}: {progress: number}) {
    return ( 
        <View style={styles.progressBar}>
            <View style={[styles.progress, {width: `${progress}%`}]}/>
        </View>
     );
}

export default ProgressBar;

const styles = StyleSheet.create({
    progressBar: {
        height: 8,
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 4,
    },
    progress: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 10
    }
})