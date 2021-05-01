const cache = require('./cache');
const getUsersData = cache.getUsers;
const getPostsData = cache.getPosts;
const getLikesData = cache.getLikes;
const getCommentsData = cache.getComments;
const getFollowsData = cache.getFollows;

let users = {
    getAll: () => getUsersData(),
    getUserById: (id) => {
        return getUsersData().find(user => user.id == id);
    },
    getPostsByUserId: (id) => getPostsData().filter(post => post.user_id == id),
    getLikesByUserId: (id) => getLikesData().filter(like => like.user_id == id),
    getCommentsByUserId: (id) => getCommentsData().filter(comment => comment.user_id == id),
    getFollowersByUserId: (id) => {
        let follows = getFollowsData().filter(follow => follow.following_id == id);
        return follows.map(follow => getUsersData().find(user => user.id == follow.follower_id));

    },
    getFollowingByUserId: (id) => {
        let follows = getFollowsData().filter(follow => follow.follower_id == id);
        return follows.map(follow => getUsersData().find(user => user.id == follow.following_id));
    }
}

let posts = {
    getAll: () => getPostsData(),
    getPostById: (id) => getPostsData().find(post => post.id == id),
    getLikesByPostId: (id) => getLikesData().filter(like => like.post_id == id),
    getCommentsByPostId: (id) => getCommentsData().filter(comment => comment.post_id == id),
    updatePostById: (id, options) => {
        for (key in options) getPostsData().find(post => post.id == id)[key] = options[key];
    },
};
let likes = {
    getAll: () => getLikesData(),
    getLikeById: (id) => getLikesData().find(like => like.id == id),
};

let comments = {
    getAll: () => getCommentsData(),
    getCommentById: (id) => getCommentsData().find(comment => comment.id == id),
};

let follows = [
]

module.exports = {
    users, posts, likes, comments
}
