// dateUtils.js
import * as FileSystem from "expo-file-system";

export const findWeekDay = () => {
  const day = new Date().getDay();
  let filePath;

  switch (day) {
    case 0:
      filePath = `${FileSystem.documentDirectory}sunday.json`;
      break;
    case 1:
      filePath = `${FileSystem.documentDirectory}monday.json`;
      break;
    case 2:
      filePath = `${FileSystem.documentDirectory}tuesday.json`;
      break;
    case 3:
      filePath = `${FileSystem.documentDirectory}wednesday.json`;
      break;
    case 4:
      filePath = `${FileSystem.documentDirectory}thursday.json`;
      break;
    case 5:
      filePath = `${FileSystem.documentDirectory}friday.json`;
      break;
    case 6:
      filePath = `${FileSystem.documentDirectory}saturday.json`;
      break;
    default:
      console.error("Invalid day");
  }

  return filePath;
};
