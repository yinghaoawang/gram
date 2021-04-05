const data = require('./sampleData');
const usersData = data.users;
const postsData = data.posts;
const likesData = data.likes;
const commentsData = data.comments;
const followsData = data.follows;

let users = {
    getAll: () => usersData,
    getUserById: (id) => usersData.find(user => user.id == id),
    getPostsByUserId: (id) => postsData.filter(post => post.user_id == id),
    getLikesByUserId: (id) => likesData.filter(like => like.user_id == id),
    getCommentsByUserId: (id) => commentsData.filter(comment => comment.user_id == id),
    getFollowersByUserId: (id) => {
        let follows = followsData.filter(follow => follow.following_id == id);
        return follows.map(follow => usersData.find(user => user.id == follow.follower_id));

    },
    getFollowingByUserId: (id) => {
        let follows = followsData.filter(follow => follow.follower_id == id);
        return follows.map(follow => usersData.find(user => user.id == follow.following_id));
    }
}

let posts = {
    getAll: () => postsData,
    getPostById: (id) => postsData.find(post => post.id == id),
    getLikesByPostId: (id) => likesData.filter(like => like.post_id == id),
    getCommentsByPostId: (id) => commentsData.filter(comment => comment.post_id == id),
    updatePostById: (id, options) => {
        for (key in options) postsData.find(post => post.id == id)[key] = options[key];
    },
};
let likes = {
    getAll: () => likesData,
    getLikeById: (id) => likesData.find(like => like.id == id),
};

let comments = {
    getAll: () => commentsData,
    getCommentById: (id) => commentsData.find(comment => comment.id == id),
};

let follows = [
]

module.exports = {
    users, posts, likes, comments
}
