import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { api } from "../../api/api";

const pendingTasks = ({ sortedTasks, setUpdate }) => {
  const isCompleted = (id) => {
    api.makeCompleted(id);
    setUpdate(true);
  };
  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setUpdate(true);
  };
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{weekdays[new Date().getDay()]}'s Tasks</Text>
        <Text style={styles.title}>
          {new Date().getHours() < 10
            ? "0" + new Date().getHours()
            : new Date().getHours()}
          :
          {new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes()}
        </Text>
      </View>
      <View style={styles.tasksWrapper}>
        {sortedTasks && sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <Pressable
              style={styles.task}
              key={index}
              onPress={() => isCompleted(task.id)}
              onLongPress={() => deleteTask(task.id)}
            >
              <View
                style={{ ...styles.colorMark, backgroundColor: task.color }}
              />
              <View style={styles.textWrapper}>
                <Text style={styles.taskText}>{task.task}</Text>
                <Text style={styles.additionalTexts}>{task.time}</Text>
              </View>
              <View
                style={{
                  ...styles.checkBox,
                  borderColor: "#ffffff50",
                  borderWidth: task.isCompleted ? 0 : 1.5,
                }}
              >
                <View
                  style={{
                    ...styles.checked,
                    display: task.isCompleted ? "flex" : "none",
                  }}
                >
                  <Image
                    source={require("../../assets/icons/checkmark.png")}
                    style={{ height: 12, width: 12 }}
                  />
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <Text
            style={{
              color: "#ffffff50",
              alignSelf: "center",
              fontSize: 18,
              marginTop: 10,
            }}
          >
            No Tasks Yet
          </Text>
        )}
      </View>
    </View>
  );
};

export default pendingTasks;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  title: {
    color: "#fff",
    paddingLeft: 10,
    fontSize: 22,
  },
  tasksWrapper: {
    paddingVertical: 20,
    width: "100%",
    minHeight: 85,
    marginTop: 15,
    backgroundColor: "#ffffff05",
    borderColor: "#ffffff10",
    borderWidth: 0.5,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  task: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "90%",
  },
  colorMark: {
    height: 35,
    width: 6,
    marginTop: 4,
    backgroundColor: "#f00",
    borderRadius: 1,
  },
  textWrapper: {
    width: "78%",
  },
  additionalTexts: {
    fontSize: 13,
    color: "#ffffff50",
  },
  taskText: {
    color: "#fff",
    fontSize: 20,
  },
  checkBox: {
    height: 25,
    width: 25,
    borderRadius: 50,
    marginRight: 10,
    overflow: "hidden",
  },
  checked: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009402",
  },
});
