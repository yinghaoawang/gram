const config = require('../../config/config');
const { Client, Pool } = require('pg');
let pool = new Pool(config.db);
