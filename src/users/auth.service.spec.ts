import { Test } from "@nestjs/testing";
import { AuthService } from "./Auth.Service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService',()=>{
    let service:AuthService;
    let fakeUserService:Partial<UsersService>

    beforeEach(async ()=>{
        const users:User[] = [];
        fakeUserService = {
            find: (email:string)=> {
                const filteredUsers = users.filter(user => user.email==email);
                return Promise.resolve(filteredUsers);
            },
            create: (email:string, password)=> {
                const user = {id:Math.floor(Math.random()*99999) ,email, password} as User
                users.push(user);
                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers:[
                AuthService,
                {
                    provide:UsersService,
                    useValue:fakeUserService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    })

    it('can create an instance of auth seervice', async ()=>{    
        expect(service).toBeDefined();
    })

    it('creates a new user with salted and hashed password',async () => {
        const user = await service.signup('ibalthaf@gmail.com','123456');
        expect(user.password).not.toEqual('123456');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    });

    it('throws if signin is called with an unused email',async () => {
        await expect(service.signin('asd@gmail.com','3424234')).rejects.toThrow(NotFoundException)
    })

    it('returns a user if correct password is provided',async () => {
        await service.signup('test@testing.com','test1234')
        const user = await service.signin('test@testing.com','test1234')
        await expect(user).toBeDefined();        
    })

    it('throws if an invalid password is provided',async () => {
        await service.signup('test@testing.com', 'test12345');
        await expect(service.signin('test@testing.com','test123455')).rejects.toThrow(BadRequestException);       
    })
});