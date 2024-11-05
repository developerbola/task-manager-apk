import { Button, View } from "react-native";
import * as Notifications from "expo-notifications";

const NotificationExample = () => {
  const showNotification = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Second, call the method

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Look at that notification",
        body: "I'm so proud of myself!",
      },
      trigger: null,
    });
  };

  return (
    <View>
      <Button title="Display Notification" onPress={showNotification} />
    </View>
  );
};

export default NotificationExample;
