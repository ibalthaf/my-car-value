import { Test } from "@nestjs/testing";
import { AuthService } from "./Auth.Service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService',()=>{
    let service:AuthService;
    let fakeUserService:Partial<UsersService>

    beforeEach(async ()=>{
        fakeUserService = {
            find: ()=> Promise.resolve([]),
            create: (email:string, password)=> Promise.resolve({id:1,email, password} as User )
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
        fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('ibalthaf@gmail.com', '123456')).rejects.toThrow(
          BadRequestException,
        );
    });

    it('throws if signin is called with an unused email',async () => {
        await expect(service.signin('asd@gmail.com','3424234')).rejects.toThrow(NotFoundException)
    })

    it('returns a user if correct password is provided',async () => {
        fakeUserService.find = ()=> Promise.resolve([{email:'test@testing.com', password:'e8b879b3c8edfa63.f040eeae75dd23afae1dc0b6c9e75e74aadefd697f5358b2d5cef16efb15e837'} as User])
        const user = await service.signin('test@testing.com','test1234')
        await expect(user).toBeDefined();        
    })

    it('throws if an invalid password is provided',async () => {
        fakeUserService.find = ()=> Promise.resolve([{email:'test@testing.com', password:'e8b879b3c8edfa63.f040eeae75dd23afae1dc0b6c9e75e74aadefd697f5358b2d5cef16efb15e837'} as User])
        await expect(service.signin('test@testing.com','test12345')).rejects.toThrow(BadRequestException);       
    })
});