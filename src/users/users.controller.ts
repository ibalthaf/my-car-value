import { Body, 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Query, 
    Delete, 
    NotFoundException,
    Session,
    UseGuards
} from '@nestjs/common';
import { CreateUSerDto } from './dtos/create-user.dto'; 
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../Interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './Auth.Service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(
        private usersService:UsersService, 
        private authService:AuthService
    ){}

    // @Get('/whoami')
    // whoAmI(@Session() session:any){
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user:User){
        return user;
    }

    @Post('/signin')
    async signin(@Body() body:CreateUSerDto, @Session() session:any){
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body:CreateUSerDto, @Session() session:any){
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param("id") id:string){
        const user = await this.usersService.findOne(parseInt(id));
        if(!user) throw new NotFoundException()
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email:string ){
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body:UpdateUserDto){
        return this.usersService.update(parseInt(id), body);
    }

}
