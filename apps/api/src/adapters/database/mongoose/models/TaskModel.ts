import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const taskSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID()
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      default: "pending"
    },
    ownerId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const TaskModel = model("Task", taskSchema);
