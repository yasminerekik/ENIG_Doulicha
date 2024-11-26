import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/users.models';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'src/dto/users.dto';
import { UserRole } from 'src/dto/register.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  // Find user by ID
  async findById(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId).exec();
  }

  // Find user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Find user by all fields (with password check)
  async findByAllFields(userDto: UserDto): Promise<User | null> {
    const { firstname, lastname, email, password, role } = userDto;
    const user = await this.userModel.findOne({ firstname, lastname, email, role }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;  // Explicitly return null if no match
  }

  // Update user information
  async updateUser(userId: string, userDto: UserDto): Promise<User | null> {
    const { firstname, lastname, email, password, role } = userDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { firstname, lastname, email, password: hashedPassword, role },
      { new: true }
    ).exec();
    return updatedUser;  // Return updated user or null if not found
  }

  // Delete user
  async deleteUser(userId: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new Error('User not found');  // Error handling if user is not found
    }
    return deletedUser;
  }

  // Compare plaintext password with hashed password
  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Assign a new role to user
  async assignRole(email: string, role: UserRole): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    return await user.save();  // Ensure the updated user is saved
  }

  // Find users by role
  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return await this.userModel.find({ role }).exec();
  }
}
