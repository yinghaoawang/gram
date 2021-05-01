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
    console.log(likes);
});
db.query("select * from follows", []).then(data => {
    follows = data.rows;
});
db.query("select * from comments", []).then(data => {
    comments = data.rows;
});


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
    getUsers, getFollows, getPosts, getLikes, getComments, addUsers, addFollows, addPosts, addLikes, addComments
};
