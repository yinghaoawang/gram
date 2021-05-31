const db = require('../db/db.js');

let users = [], comments = [], likes = [], follows = [], posts = [];


db.query("select * from users", []).then(data => {
    users = data.rows;
});
db.query("select * from posts", []).then(data => {
    posts = data.rows;
});
db.query("select * from likes", []).then(data => {
    likes = data.rows;
});
db.query("select * from follows", []).then(data => {
    follows = data.rows;
});
db.query("select * from comments", []).then(data => {
    comments = data.rows;
});



const addUser = async (userData) => {
    try {
        let { email, username, nickname, hashed_password } = userData;

        let values = [email, username, nickname, hashed_password];
        let query = `insert into users (email, username, nickname, hashed_password) values ($1, $2, $3, $4)`;
        let res = await db.query(query, values);
        let res2 = await db.query('select * from users where username = $1', [username]);
        users.push(res2.rows[0]);
        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}
const getUsers = () => users;
const getComments = () => comments;
const getLikes = () => likes;
const getFollows = () => follows;
const getPosts = () => posts;
const addUsers = usersToAdd => { users = users.concat(usersToAdd); }
const addFollows = followstoAdd => { follows = follows.concat(followstoAdd); }
const addPosts = postsToAdd => { posts = posts.concat(postsToAdd); }
const addLikes = likesToAdd => { likes = likes.concat(likesToAdd); }
const addComments = commentsToAdd => { comments = comments.concat(commentsToAdd); }

module.exports = {
    getUsers, getFollows, getPosts, getLikes, getComments, //addUsers, addFollows, addPosts, addLikes, addComments,
    addUser
};
