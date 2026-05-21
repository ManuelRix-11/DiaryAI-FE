import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set notification handler to show notifications even when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const NotificationsService = {
    async requestPermissions() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    },

    async recordDiaryWrittenToday() {
        const todayStr = new Date().toISOString().split('T')[0];
        await AsyncStorage.setItem('@diaryai:last_written_date', todayStr);
        await this.scheduleStreakReminders();
    },

    async scheduleStreakReminders() {
        // First, cancel any previously scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Check if user already wrote today
        const todayStr = new Date().toISOString().split('T')[0];
        const lastWrittenDate = await AsyncStorage.getItem('@diaryai:last_written_date');
        const hasWrittenToday = lastWrittenDate === todayStr;

        // We schedule a notification for the next 14 days at 20:00
        const now = new Date();
        const daysToSchedule = 14;
        
        // Start day index: if they already wrote today, we start from tomorrow (day 1)
        // If they haven't written today, we start from today (day 0) if it's before 20:00
        const startDayIndex = hasWrittenToday ? 1 : 0;

        for (let i = startDayIndex; i <= daysToSchedule; i++) {
            const triggerDate = new Date();
            triggerDate.setDate(now.getDate() + i);
            triggerDate.setHours(20, 0, 0, 0);

            // If we are scheduling for today (i === 0) but it's already past 20:00, skip it
            if (i === 0 && now.getTime() >= triggerDate.getTime()) {
                continue;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Non spezzare la catena! 🔥',
                    body: 'Scrivi il tuo diario di oggi per mantenere la tua streak attiva.',
                    sound: true,
                },
                trigger: { 
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: triggerDate 
                },
            });
        }
    }
};
