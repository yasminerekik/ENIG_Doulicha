import { Controller, Post, Body, Get, Put, Delete, Param, BadRequestException, UnauthorizedException, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDto } from '../dto/users.dto';
import { User } from 'src/models/users.models';
import { UserRole } from 'src/dto/register.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<any> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<any> {
    const user = await this.userService.findById(userId);
    return user;
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() userDto: UserDto, 
  ): Promise<any> {
    const updatedUser = await this.userService.updateUser(userId, userDto); 
    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<any> {
    await this.userService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  @Post('check-email')
  async checkEmail(@Body('email') email: string): Promise<{ exists: boolean }> {
    const user = await this.userService.findByEmail(email);
    return { exists: !!user };
  }
 
  @Get('role/:role')
async getUsersByRole(@Param('role') role: string): Promise<User[]> {
  console.log('Received role:', role);  // Log the incoming role parameter

  // Check if the provided role exists in the enum values
  const roleEnum = Object.values(UserRole).find(r => r === role);
  console.log('Mapped roleEnum:', roleEnum);  // Log the mapped enum value

  if (!roleEnum) {
    throw new BadRequestException('Invalid role');
  }

  return await this.userService.findByRole(roleEnum);
}



}
