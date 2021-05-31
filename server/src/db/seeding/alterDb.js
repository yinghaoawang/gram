const config = require('../../config/config');
const { Client, Pool } = require('pg');
let pool = new Pool(config.db);

pool.query(`alter table users add email varchar(255)`
).then((res) => {
    console.log("db updated", res);
    return pool.end()
}).catch(err => {
    console.error(err);
});

