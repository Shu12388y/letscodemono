import mongoose from "mongoose";

export const DB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};
