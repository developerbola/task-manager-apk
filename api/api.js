import * as FileSystem from "expo-file-system";
import { findWeekDay } from "../helpers/findWeekDay";

export const api = {
  // Fetch tasks from the local JSON file
  getTasks: async () => {
    const filePath = findWeekDay();
    try {
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  },

  // Add a task to the local JSON file
  postTasks: async (task) => {
    const filePath = findWeekDay();
    try {
      // Ensure the task is parsed as an object if it's accidentally passed as a string
      const parsedTask = typeof task === "string" ? JSON.parse(task) : task;

      const currentTasks = await api.getTasks();
      const updatedTasks = [...currentTasks, parsedTask];

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedTasks)
      );
      return updatedTasks;
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  },
  // Delete a task from the local JSON file
  deleteTask: async (taskId) => {
    const filePath = findWeekDay();
    try {
      const currentTasks = await api.getTasks();
      const updatedTasks = currentTasks.filter((task) => task.id !== taskId);
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedTasks)
      );
      return updatedTasks;
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },

  // Mark a task as completed in the local JSON file
  makeCompleted: async (id) => {
    const filePath = findWeekDay();
    try {
      const currentTasks = await api.getTasks();
      const updatedTasks = currentTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: true } : task
      );
      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(updatedTasks)
      );
      return updatedTasks;
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  },
};
