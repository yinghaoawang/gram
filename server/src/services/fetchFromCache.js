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
    getUsers: (options) => getUsersData().filter(user => {
        for (const [key, value] of Object.entries(options)) {
            if (user[key] != value) return false;
        }
        return true;
    }),

}

let posts = {
    getAll: () => getPostsData(),
    getPostById: (id) => getPostsData().find(post => post.id == id),
    getPostsByUserId: (id) => getPostsData().filter(post => post.user_id == id),
    getPosts: (options) => getPostsData().filter(post => {
        for (const [key, value] of Object.entries(options)) {
            if (post[key] != value) return false;
        }
        return true;
    }),

    updatePostById: (id, options) => {
        for (key in options) getPostsData().find(post => post.id == id)[key] = options[key];
    },
};
let likes = {
    addLike: async (likeData) => {
        return await cache.addLike(likeData);
    },
    removeLike: async (likeData) => {
        return await cache.removeLike(likeData);
    },
    getAll: () => getLikesData(),
    getLikeById: (id) => getLikesData().find(like => like.id == id),
    getLikesByUserId: (id) => getLikesData().re(like => like.user_id == id),
    getLikesByPostId: (id) => getLikesData().filter(like => like.post_id == id),
    getLikes: (options) => getLikesData().filter(like => {
        for (const [key, value] of Object.entries(options)) {
            if (like[key] != value) return false;
        }
        return true;
    }),
};

let comments = {
    addComment: async (commentData) => {
        return await cache.addComment(commentData);
    },
    getAll: () => getCommentsData(),
    getCommentsByPostId: (id) => getCommentsData().filter(comment => comment.post_id == id),
    getCommentsByUserId: (id) => getCommentsData().filter(comment => comment.user_id == id),
    getCommentById: (id) => getCommentsData().find(comment => comment.id == id),
    getComments: (options) => getCommentsData().filter(comment => {
        for (const [key, value] of Object.entries(options)) {
            if (comment[key] != value) return false;
        }
        return true;
    }),
};

let follows = {
    addFollow: async (followData) => {
        return await cache.addFollow(followData);
    },
    removeFollow: async (followData) => {
        return await cache.removeFollow(followData);
    },
    getAll: () => getFollowsData(),
    getFollowingByUserId: (id) => getFollowsData().filter(follow => follow.follower_id == id),
    getFollowersByUserId: (id) => getFollowsData().filter(follow => follow.following_id == id),
    getFollows: (options) => getFollowsData().filter(follow => {
        for (const [key, value] of Object.entries(options)) {
            if (follow[key] != value) return false;
        }
        return true;
    }),
}

module.exports = {
    users, posts, likes, comments, follows
}
