var dbConfig = {
    synchronize:false,
    migrations:['migrations/*.js'],
    cli:{
        migrationsDir: 'migrations'
    }
}

switch(process.env.NODE_ENV){
    case 'development':
        Object.assign(dbConfig,{
            type:"sqlite",
            database:"db.sqlite",
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbConfig,{
            type:"sqlite",
            database:"test.sqlite",
            entities: ['**/*.entity.js'],
        });
        break;
    case 'production':
    default:
        throw new Error("Unknown Environment")
}

module.exports = dbConfig;