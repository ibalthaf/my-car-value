import { Test } from "@nestjs/testing";
import { AuthService } from "./Auth.Service";
import { UsersService } from "./users.service";

it('can create an instance of auth seervice', async ()=>{
    const module = await Test.createTestingModule({
        providers:[AuthService]
    }).compile();

    const service = module.get(AuthService);
    expect(service).toBeDefined();
})