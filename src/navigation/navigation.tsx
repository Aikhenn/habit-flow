import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainNavigator from "./mainNavigator";

const Stack = createNativeStackNavigator();

function RootNavigator() {
    return ( 
        <Stack.Navigator>
            <Stack.Screen  
                name="Main"
                component={MainNavigator}
                options={{headerShown: false}}  
       
            />
        </Stack.Navigator>
     );
}

export default RootNavigator;