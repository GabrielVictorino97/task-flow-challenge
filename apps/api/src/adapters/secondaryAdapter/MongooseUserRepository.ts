import mongoose from "mongoose";
import { User } from "../../core/entity/User";
import { UserRepositoryPort } from "../../core/ports/UserRepositoryPort";
import { UserModel } from "../database/mongoose/models/UserModel";

function mapToUser(document: any): User {
  return {
    id: document._id.toString(),
    fullName: document.fullName,
    email: document.email,
    passwordHash: document.passwordHash,
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt)
  };
}

export class MongooseUserRepository implements UserRepositoryPort {
  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await UserModel.findById(id).lean();

    return user ? mapToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

    return user ? mapToUser(user) : null;
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const created = await UserModel.create(user);
    return mapToUser(created.toObject());
  }
}
