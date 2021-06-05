const cache = require('./cache');
const hashing = require('../hashing.js');
const getUsersData = cache.getUsers;
const getPostsData = cache.getPosts;
const getLikesData = cache.getLikes;
const getCommentsData = cache.getComments;
const getFollowsData = cache.getFollows;

let users = {
    addUser: async (userData) => {
        try {
            let hashedPassword = await hashing.hashPassword(userData.password);
            userData.hashed_password = hashedPassword;
            let user = await cache.addUser(userData);
            if (user != null) {
                console.error("User added: " + user);
                return user;
            } else {
                throw new Error("Unable to add user");
            }
        } catch(e) {
            console.error("Unable to add user: " + userData);
            return null;
        }

    },
    getAll: () => getUsersData(),
    getUserById: (id) => {
        return getUsersData().find(user => user.id == id);
    },
    getUserByUsername: (username) => {
        return getUsersData().find(user => user.username == username);
    },

}

let posts = {
    getAll: () => getPostsData(),
    getPostById: (id) => getPostsData().find(post => post.id == id),
    getPostsByUserId: (id) => getPostsData().filter(post => post.user_id == id),

    updatePostById: (id, options) => {
        for (key in options) getPostsData().find(post => post.id == id)[key] = options[key];
    },
};
let likes = {
    addLike: async (likeData) => {
        try {
            let like = await cache.addLike(likeData);
            if (like != null) {
                console.error("Like added: " + JSON.stringify(like));
                return like;
            } else {
                throw new Error("Unable to add like");
            }
        } catch(e) {
            console.error("Unable to add like: " + likeData);
            return null;
        }
    },
    getAll: () => getLikesData(),
    getLikeById: (id) => getLikesData().find(like => like.id == id),
    getLikesByUserId: (id) => getLikesData().filter(like => like.user_id == id),
    getLikesByPostId: (id) => getLikesData().filter(like => like.post_id == id),
};

let comments = {
    getAll: () => getCommentsData(),
    getCommentsByPostId: (id) => getCommentsData().filter(comment => comment.post_id == id),
    getCommentsByUserId: (id) => getCommentsData().filter(comment => comment.user_id == id),
    getCommentById: (id) => getCommentsData().find(comment => comment.id == id),
};

let follows = {
    getAll: () => getFollowsData(),
    getFollowingByUserId: (id) => getFollowsData().filter(follow => follow.following_id == id),
    getFollowersByUserId: (id) => getFollowsData().filter(follow => follow.follower_id == id),
}

module.exports = {
    users, posts, likes, comments, follows
}
