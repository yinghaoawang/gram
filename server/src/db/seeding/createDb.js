const config = require('../../config/config');
const { Client, Pool } = require('pg');

const dbname = 'gram';

let preMakeConfig = Object.assign({}, config.db);
preMakeConfig.database = 'postgres';

let postMakePool;
let pool = new Pool(preMakeConfig);

pool.query(`drop database if exists ${dbname}`
).then(() =>
    pool.query(`create database ${dbname}`)
).then(() => {
    return pool.end()
}).then(() => {
    postMakePool = new Pool(config.db);
    return postMakePool.query(`create table users (
        "id" serial primary key,
        "username" varchar(35),
        "pfp_url" varchar(255),
        "nickname" varchar(35),
        "group" varchar(35),
        "description" text,
        "created_at" timestamp
    )`)
}).then(() => {
    return postMakePool.query(`create table posts (
        "id" serial primary key,
        "user_id" integer references users,
        "img_url" varchar(255),
        "description" varchar(255),
        "ranking" integer,
        "created_at" timestamp
    )`)
    console.log("created posts");
}).then(() => 
    postMakePool.query(`create table likes (
        "id" serial primary key,
        "user_id" integer references users,
        "post_id" integer references posts,
        "created_at" timestamp
    )`)
).then(() => 
    postMakePool.query(`create table comments (
        "id" serial primary key,
        "user_id" integer references users,
        "post_id" integer references posts,
        "message" varchar(255),
        "created_at" timestamp
    )`)
).then(() => 
    postMakePool.query(`create table follows (
        "id" serial primary key,
        "follower_id" integer references users,
        "following_id" integer references users,
        "created_at" timestamp
    )`)
).catch(err => {
    console.error(err);
});

