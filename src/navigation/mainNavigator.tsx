import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/home";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import COLORS from "../constants/colors";
import hexToRgba from "../utils/hexConverter";
import Octicons from "@react-native-vector-icons/octicons";

const Tab = createBottomTabNavigator();

const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
    <MaterialIcons
        name="checklist-rtl"
        size={size}
        color={color}
    />
);

const NotesTabIcon = ({ color, size }: { color: string; size: number }) => (
    <Octicons
        name="checklist"
        size={size}
        color={color}
    />
);

function MainNavigator()  {


    return(
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor:hexToRgba(COLORS.BLACK, 0.4),
            }}
        >
            <Tab.Screen 
                name="Tasks" 
                component={HomeScreen} 
                options={{
                    headerShown: false,
                    tabBarIcon: HomeTabIcon,
                }}
              
            />
               {/* <Tab.Screen 
                name="Notes" 
                component={HomeScreen} 
                options={{
                    headerShown: false,
                    tabBarIcon: NotesTabIcon,
                }}
              
            /> */}
        </Tab.Navigator>
    );

}

export default MainNavigator;