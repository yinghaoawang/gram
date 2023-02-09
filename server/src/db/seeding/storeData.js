const path = require('path');
let args = process.argv.slice(2);


if (args[0] == null) {
    console.log('Need a json file in args.');
    return;
}

let data = require('./' + args[0]);

const db = require('../db');

let users = data.users;
let posts = data.posts;
let likes = data.likes;
let follows = data.follows;
let comments = data.comments;
let storeData = async (datas, tableName) => {
    let promises = [];
    for (let datum of datas) {
        if (tableName == 'comments' && datum.message.length > 255) {
            datum.message = datum.message.substring(0,255);
        }
        Object.keys(datum).filter(key => ['id'].includes(key)).forEach(key => delete datas[key]);
        let qS = [...Array(Object.keys(datum).length).keys()];
        qS.forEach((key, i) => {qS[i] = '$' + (key + 1)});
        let keys = '\"' + Object.keys(datum).join('\", \"') + '\"';
        //let values = "\'" + Object.values(datum).join("\', \'") + "\'";
        let query = {
            text: `insert into ${tableName} (${keys}) values (${qS}) on conflict (id) do nothing`,
            values: Object.values(datum)
        }
        let query2 = {
            text: `SELECT setval('${tableName}_id_seq', (SELECT MAX(id) FROM ${tableName}) + 1)`
        }
        promises.push(db.query(query));
        promises.push(db.query(query2));
    }
    return Promise.all(promises);
}

let resetAutoIncrementAll = async() => {
    let keys = ['users', 'posts', 'likes', 'follows', 'comments'];
    for (let key of keys) {
        try {
            let query = `SELECT SETVAL('${key}_id_seq', (SELECT MAX(id) FROM ${key}));`;
            await db.query(query);
        } catch(err) {
            console.err(err);
        }
    }
    
}

let storeAll = async (options) => {
    try {
        let res = await storeData(options.users, 'users');
        res = await storeData(options.posts, 'posts');
        res = await storeData(options.likes, 'likes');
        res = await storeData(options.follows, 'follows');
        res = await storeData(options.comments, 'comments');
        await resetAutoIncrementAll();
    } catch(e) {
        console.log(e);
    }
}
storeAll({users, posts, likes, follows, comments});
