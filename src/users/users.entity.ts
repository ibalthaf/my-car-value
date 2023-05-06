import { Report } from '../reports/reports.entity';
import { 
    AfterInsert, 
    AfterRemove, 
    AfterUpdate, 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(()=>Report, (report)=> report.user )
    reports:Report[]

    @Column()
    email:string;

    @Column()
    password:string;

    @Column({default:true})
    admin:boolean

    @AfterInsert()
    logInsert(){
        console.log("Inserted user with id ", this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("Updated id", this.id);
        
    }

    @AfterRemove()
    logRemove(){
        console.log("Removed id",this.id);
        
    }
}