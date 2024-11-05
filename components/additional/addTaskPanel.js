import React, { useState, useRef, useEffect } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import pencil from "../../assets/icons/pencil.png";
import close from "../../assets/icons/close.png";
import Loader from "../UI/loader";
import { api } from "../../api/api";

const AddTaskPanel = ({ tasks, setUpdate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  // task details
  const [taskTitle, setTaskTitle] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  // Refs
  const endTimeRef = useRef(null);

  const formatTime = (text) => {
    let cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);

    let hours =
      cleaned.slice(0, 2) > 23 ? cleaned.slice(0, 1) : cleaned.slice(0, 2);

    let minutes =
      hours == cleaned.slice(0, 1) ? cleaned.slice(1, 3) : cleaned.slice(2, 4);

    if (parseInt(hours) > 23) hours = "23";

    if (parseInt(minutes) > 59) minutes = "59";

    return (hours ? hours + ":" : "") + minutes;
  };

  const handleStartTimeChange = (text) => {
    const formattedTime = formatTime(text);
    setStartTime(formatTime(text));

    if (formattedTime.split(":")[0] < 10 && formattedTime?.length === 4) {
      endTimeRef.current?.focus();
    }

    if (formattedTime?.length === 5) {
      endTimeRef.current?.focus();
    }
  };

  const handleEndTimeChange = (text) => {
    setEndTime(formatTime(text));
  };

  const handlePress = (color) => {
    setSelectedColor(color);
  };


  useEffect(() => {
    setSelectedColor(null);
    setTaskTitle("");
    setStartTime("");
    setEndTime("");
  }, [isVisible]);

  const time = `${startTime} - ${endTime}`;

  const newTask = {
    task: taskTitle ? taskTitle : "Task Title",
    time: time,
    isCompleted: false,
    color: selectedColor ? selectedColor : "#ffffff80",
    id: Date.now().toString(),
  };
  const addTask = async () => {
    if (!taskTitle || !startTime || !endTime) {
      Alert.alert("You need to fill all fields!");
      return;
    }
    setIsPosting(true);
    try {
      await api.postTasks(newTask);
    } catch (error) {
      console.log(error);
    } finally {
      setIsVisible(false);
      setIsPosting(false);
      setUpdate(true);
      setSelectedColor(null);
      setTaskTitle("");
      setStartTime("");
      setEndTime("");
    }
  };

  const colors = [
    "#1E90FF",
    "#40E0D0",
    "#87CEEB",
    "#98FF98",
    "#DFFF00",
    "#FFA500",
    "#FF4D4D",
    "#FF69B4",
    "#FF7F50",
    "#B19CD9",
    "#E6E6FA",
    "#FFFF66",
  ];

  return (
    <>
      <Pressable style={styles.toggler} onPress={() => setIsVisible(true)}>
        <Image source={pencil} style={styles.pencilImg} />
      </Pressable>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        style={styles.modal}
        swipeDirection="down"
        onSwipeComplete={() => setIsVisible(false)}
      >
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={{ color: "#fff", fontSize: 30 }}>New Task</Text>
            <Pressable onPress={() => setIsVisible(false)}>
              <Image source={close} style={styles.pencilImg} />
            </Pressable>
          </View>
          <View style={styles.taskContainer}>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              placeholderTextColor="#ffffff90"
              onChangeText={(text) => setTaskTitle(text)}
              value={taskTitle}
            />
            <View style={styles.colorsContainer}>
              {colors.map((color, index) => {
                const isActive = color === selectedColor;
                return (
                  <TouchableOpacity
                    style={{
                      ...styles.circle,
                      backgroundColor: color,
                    }}
                    onPress={() => handlePress(color)}
                    key={index}
                  >
                    <View
                      style={{
                        ...styles.activeCircle,
                        display: isActive ? "block" : "none",
                      }}
                    ></View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.timeContainer}>
              <View style={styles.timeWrapper}>
                <Text style={{ color: "white" }}>from:</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="00:00"
                  placeholderTextColor="#ffffff90"
                  keyboardType="numeric"
                  onChangeText={handleStartTimeChange}
                  value={startTime}
                  maxLength={5}
                />
                <Text style={{ color: "white" }}>until:</Text>
                <TextInput
                  ref={endTimeRef}
                  style={styles.timeInput}
                  placeholder="00:00"
                  placeholderTextColor="#ffffff90"
                  keyboardType="numeric"
                  onChangeText={handleEndTimeChange}
                  value={endTime}
                  maxLength={5}
                />
              </View>
            </View>
            <Pressable
              style={styles.addBtn}
              onPress={() => {
                addTask();
              }}
            >
              {isPosting ? (
                <Loader />
              ) : (
                <Text style={styles.addText}>Add Task</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddTaskPanel;

const styles = StyleSheet.create({
  toggler: {
    position: "absolute",
    top: 680,
    left: "70%",
    height: 80,
    width: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderWidth: 0.8,
    borderColor: "#ffffff20",
    borderRadius: 50,
  },
  pencilImg: {
    height: 30,
    width: 30,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#000",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.2,
    borderColor: "#ffffff60",
    padding: 40,
    height: "85%",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskContainer: {
    paddingVertical: 20,
  },
  input: {
    color: "#fff",
    borderWidth: 1,
    borderColor: "#ffffff30",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontSize: 20,
  },
  colorsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 5,
    flexWrap: "wrap",
    gap: 10,
  },
  circle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 35,
    borderRadius: 50,
  },
  activeCircle: {
    display: "none",
    height: 28,
    width: 28,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#000",
  },
  timeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
  timeWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  timeInput: {
    color: "#fff",
    borderWidth: 1,
    borderColor: "#ffffff30",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    width: 80,
    textAlign: "center",
  },
  addBtn: {
    borderWidth: 0.5,
    borderColor: "#ffffff40",
    borderRadius: 15,
    marginTop: 20,
    height: 55,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#FFF",
    fontSize: 20,
  },
});
