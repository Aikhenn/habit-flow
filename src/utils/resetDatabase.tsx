import { Alert } from 'react-native';
import { resetDatabase } from '../database/database';

export const handleResetDatabase = () => {
    Alert.alert(
        'Reset Database',
        'This will permanently delete all your tasks. Continue?',
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Reset',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await resetDatabase();

                        Alert.alert(
                            'Success',
                            'Database has been reset.'
                        );
                    } catch (error) {
                        console.error(error);
                    }
                },
            },
        ]
    );
};