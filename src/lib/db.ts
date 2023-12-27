import * as fs from "fs";
import {Data} from "../types/all";

export const readData = (dataFilePath: string): Data => {
  const rawData = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(rawData);
};

// Function to write data
export const writeData = (data: Data, dataFilePath: string): void => {
  const dataToSave = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataFilePath, dataToSave, 'utf8');
};
