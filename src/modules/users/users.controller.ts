import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUsertDto } from './dtos/update-user.dto';
import { SelfGuard } from '../../common/guards/self.guard';
import { Public } from '../../common/decorators/public.decorator';
import { ILoginResponse, IUserPayload } from './models/users-login.model';
import { IExpressRequestWithUser } from './models/express-request-with-user.model';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Public()
	@Post('register')
	async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
		console.log('register user controller', createUserDto);
		return this.usersService.registerUser(createUserDto);
	}

	@Public()
	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
		return this.usersService.loginUser(loginUserDto);
	}

	@Get()
	userDetails(@Request() req: IExpressRequestWithUser): IUserPayload {
		return req.user;
	}

	@Patch(':id')
	@UseGuards(SelfGuard)
	async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUsertDto
	): Promise<User> {
		return this.usersService.updateUser(+id, updateUserDto);
	}

	@Delete(':id')
	@UseGuards(SelfGuard)
	async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
		return this.usersService.deleteUser(+id);
	}
}
