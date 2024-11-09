import React, { useEffect, useState } from "react";
import {
  Appearance,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Top, PendingTasks, AddTask } from "./components/components";
import { api } from "./api/api";
import { StatusBar } from "expo-status-bar";
import showNotification from "./helpers/showNotification";
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [update, setUpdate] = useState(false);
  const [time, setTime] = useState(
    new Date().getHours() + ":" + (parseInt(new Date().getMinutes()) + 1)
  );
  const getTasks = async () => {
    const res = await api.getTasks();
    setTasks(res || []);
  };

  useEffect(() => {
    getTasks();
    setUpdate(false);
  }, [update]);

  const getStartTime = (task) => {
    if (!task || !task.time) return Infinity;
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

  useEffect(() => {
    Appearance.setColorScheme("light");
    setInterval(() => {
      setTime(
        new Date().getHours() + ":" + (parseInt(new Date().getMinutes()) + 1)
      );
    }, 1000);
  }, []);

  useEffect(() => {
    const [startTaskTime] = filteredTasks[0]?.time?.split(" - ") || [];

    if (startTaskTime == time) {
      showNotification(filteredTasks[0]?.task, filteredTasks[0]?.time);
    }
  }, [time, filteredTasks]);

  return (
    <>
      <ImageBackground source={require("./assets/bg.png")}>
        <StatusBar hidden />
        <ScrollView style={styles.container} overScrollMode="never">
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
