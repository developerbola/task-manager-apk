import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Top, PendingTasks, AddTask } from "./components/components";
import { api } from "./api/api";
import NotificationExample from "./components/home/notification";
import { StatusBar } from "expo-status-bar";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [update, setUpdate] = useState(false);

  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  const getTasks = async () => {
    const res = await api.getTasks();
    setTasks(res || []);
  };

  useEffect(() => {
    getTasks();
    setRefresh(false);
    setUpdate(false);
  }, [refresh, update]);

  const getStartTime = (task) => {
    if (!task.time) return Infinity; // Handle missing `time`
    const [startTime] = task.time.split(" - ");
    const [hours, minutes] = startTime.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const refTotalMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const sortedTasks = tasks.length
    ? tasks.sort((a, b) => getStartTime(a) - getStartTime(b))
    : [];
  const filteredTasks = tasks.length
    ? tasks.filter((task) => getStartTime(task) > refTotalMinutes)
    : [];

  return (
    <>
      <ImageBackground source={require("./assets/bg.png")}>
        <StatusBar hidden />
        <ScrollView
          style={styles.container}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        >
          <NotificationExample />
          <Top tasks={tasks} filteredTasks={filteredTasks} />
          <PendingTasks sortedTasks={sortedTasks} setUpdate={setUpdate} />
        </ScrollView>
        <AddTask tasks={sortedTasks} setUpdate={setUpdate} />
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
    paddingHorizontal: 20,
  },
});

export default App;
