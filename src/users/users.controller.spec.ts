import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './Auth.Service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {

    fakeUsersService={
      findOne:(id:number)=>{
        return  Promise.resolve({id, email:"ibalthaf@gmail.com", password:"123456"} as User)
      },
      find:(email:string)=>{
        return Promise.resolve([{id:1, email, password:"123456"} as User])
      },
      // remove:()=>{},
      // update:()=>{}
    };
    fakeAuthService={
      // signup:()=>{},
      signin:(email, password)=>{
        return Promise.resolve({id:1, email, password} as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue:fakeUsersService
        },
        {
          provide:AuthService,
          useValue:fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async ()=>{
    const users = await controller.findAllUsers('ibalthaf1@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0]).toBeDefined();
    expect(users[0].email).toEqual('ibalthaf1@gmail.com')
  });

  it('findUser returns a single user with given id',async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found',async () => {
    fakeUsersService.findOne = ()=> null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  });

  it('signin updates session object and returns user',async () => {
    const session = {userId:-10};
    const user = await controller.signin({email:'ibalthaf@gmail.com', password:'12345'}, session);
    expect(user.id).toEqual(1);
    expect(session).toBeDefined();
    expect(session.userId).toEqual(1);
  })

});
