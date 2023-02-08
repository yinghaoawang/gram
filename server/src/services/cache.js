const db = require('../db/db.js');
const errObj = require('../err').errObj;

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
        errObj.err = err;
        return null;
    }
}
const addLike = async (likeData) => {
    try {
        let { user_id, post_id } = likeData;
        let values = [user_id, post_id];
        let query = `insert into likes (user_id, post_id) values ($1, $2) returning id`;
        let res = await db.query(query, values);
        let like_id = res.rows[0].id;
        let res2 = await db.query('select * from likes where id = $1', [like_id]);
        likes.push(res2.rows[0]);
        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const removeLike = async (likeData) => {
    try {
        let { id } = likeData;
        let values = [id];
        let query = `delete from likes where id = $1 returning *`;
        let res = await db.query(query, values);
        console.log('deleted: ' + JSON.stringify(res.rows[0]));
        for (let i = 0; i < likes.length; ++i) {
            let like = likes[i];
            if (like.id == id) {
                console.log('like found, splicing 1');
                likes.splice(i, 1);
                break;
            }
        }
        return res;
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const addPost = async (postData) => {
    try {
        let { user_id, img_url, description } = postData;
        let values = [user_id, img_url, description];
        let query = `insert into posts (user_id, img_url, description) values ($1, $2, $3) returning id`;
        let res = await db.query(query, values);
        let post_id = res.rows[0].id;
        let res2 = await db.query('select * from posts where id = $1', [post_id]);
        posts.push(res2.rows[0]);
        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const addComment = async (commentData) => {
    try {
        let { user_id, post_id, message } = commentData;
        let values = [user_id, post_id, message];
        let query = `insert into comments (user_id, post_id, message) values ($1, $2, $3) returning id`;
        let res = await db.query(query, values);
        let comment_id = res.rows[0].id;
        let res2 = await db.query('select * from comments where id = $1', [comment_id]);
        comments.push(res2.rows[0]);
        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const updatePostById = async (postId, postData) => {
    try {
        let { user_id, img_url, description, ranking } = postData;
        let values = [user_id, img_url, description, ranking, postId];
        //for (let value of values) if (value == null) value = null;
        let query = `update posts set user_id=coalesce($1,user_id), img_url=coalesce($2,img_url), description=coalesce($3,description), ranking=coalesce($4,ranking) where id=$5 returning id`;
        let res = await db.query(query, values);
        let post_id = res.rows[0].id;
        let res2 = await db.query('select * from posts where id = $1', [post_id]);

        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const addFollow = async (followData) => {
    try {
        let { follower_id, following_id } = followData;
        let values = [follower_id, following_id];
        let query = `insert into follows (follower_id, following_id) values ($1, $2) returning id`;
        let res = await db.query(query, values);
        let follow_id = res.rows[0].id;
        let res2 = await db.query('select * from follows where id = $1', [follow_id]);
        follows.push(res2.rows[0]);
        return res2.rows[0];
    } catch (err) {
        console.error("error", err.message);
        return null;
    }
}

const removeFollow = async (followData) => {
    try {
        let { follower_id, following_id } = followData;
        let values = [follower_id, following_id];
        let query = `delete from follows where follower_id = $1 and following_id = $2 returning *`;
        let res = await db.query(query, values);
        console.log('deleted: '  + JSON.stringify(res.rows[0]));
        if (res.rows[0] == null) {
            for (let i = 0; i < follows.length; ++i) {
                let follow = follows[i];
                if (follow.follower_id == follower_id && follow.following_id == following_id) {
                    console.log("clearing cache of follow meant to be deleted");
                    follows.splice(i, 1);
                }
            }
            return null;
        } else {
            for (let i = 0; i < follows.length; ++i) {
                let follow = follows[i];
                if (follow.id == res.rows[0].id) {
                    console.log('follow found, splicing 1');
                    follows.splice(i, 1);
                    break;
                }
            }
            return res.rows[0];
        }


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

module.exports = {
    getUsers, getFollows, getPosts, getLikes, getComments,
    addUser, addLike, addComment, addFollow, addPost,
    removeFollow, removeLike,
    updatePostById
};
