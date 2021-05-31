const express = require('express');
const router = express.Router();
const dataFetch = require('../services/fetchFromCache');
const utils = require('../utils');
const hashing = require('../hashing');
const bodyParser = require('body-parser');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth');
const { check } = require('../validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const accessTokenSecret = config.jwt.secret;
const sessionTokenSecret = config.session.secret;

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(cookieParser());

router.use(session({
    secret: sessionTokenSecret,
    httpOnly: true
}))

router.use(authenticateJWT);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/users/me', async (req, res) => {
    try {
        console.log("hi");
        if (req.user != null) {
            console.log(req.user);
            let user = await dataFetch.users.getUserById(req.user.id);
            console.log(user);
            res.status(200).json(user);

        } else res.status(401).send('Not logged in');
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        if (req.body.user == null) throw new Error('No user post data');
        let userInfo = JSON.parse(req.body.user);
        console.log(userInfo);
        const { username, password } = userInfo;

        const user = dataFetch.users.getUserByUsername(username);
        let passwordCorrect = false;
        if (user != null) passwordCorrect = await hashing.checkPassword(password, user.hashed_password);

        if (user != null && passwordCorrect) {
            // Generate an access token
            const accessToken = jwt.sign({ id: user.id, username: user.username,  role: user.role }, accessTokenSecret,
                {expiresIn: '10s'});
            res.cookie('token', accessToken, { httpOnly: true, sameSite: "strict" });

            res.status(200).json({token: accessToken});
        } else {
            res.status(400).send('Username or password incorrect');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }

});

router.post('/users/create', async function(req, res, next) {
    try {
        if (req.body.user == null) throw new Error('No user post data');
        let userInfo = JSON.parse(req.body.user);
        let { username, password, email } = userInfo;
        let user = null;
        if (check(password).isPassword() &&
            check(username).isUsername() &&
            check(email).isEmail()
        ) {
            user = await dataFetch.users.addUser(userInfo);
        } else {
            console.log("User details not valid");
        }
        if (user) {
            const accessToken = jwt.sign({ id: user.id, username: user.username,  role: user.role }, accessTokenSecret,
                {expiresIn: '10s'});
            res.cookie('token', accessToken, { httpOnly: true, sameSite: "strict" });
            res.status(200).json({token: accessToken});
        } else {
            res.status(401).send('Unable to create user');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }

});

router.get('/users', function(req, res, next) {
  res.json({users: dataFetch.users.getAll()});
});

router.get('/user/:user_id', function(req, res, next) {
    res.json({
        user: dataFetch.users.getUserById(req.params.user_id)
    });
});

router.get('/user/:user_id/posts', function(req, res, next) {
    posts = dataFetch.users.getPostsByUserId(req.params.user_id);
    posts.map((p) => updateRanking(p));

    res.json({
        userId: req.params.user_id,
        posts
    });
});

router.get('/user/:user_id/likes', function(req, res, next) {
    res.json({
        userId: req.params.user_id,
        likes: dataFetch.users.getLikesbyUserId(req.params.user_id),
    });
});

router.get('/user/:user_id/comments', function(req, res, next) {
    res.json({
        userId: req.params.user_id,
        comments: dataFetch.users.getCommentsbyUserId(req.params.user_id),
    });
});

router.get('/user/:user_id/followers', function(req, res, next) {
    res.json({
        userId: req.params.user_id,
        followers: dataFetch.users.getFollowersByUserId(req.params.user_id),
    });
});

router.get('/user/:user_id/following', function(req, res, next) {
    res.json({
        userId: req.params.user_id,
        following: dataFetch.users.getFollowingByUserId(req.params.user_id),
    });
});

router.get('/posts', function(req, res, next) {
    let posts = dataFetch.posts.getAll();
    posts.map((post) => updateRanking(post));
    res.json({posts});
});


router.get('/post/:post_id', function(req, res, next) {
    let post = dataFetch.posts.getPostById(req.params.post_id);
    updateranking(post);
    res.json({post});
});

router.get('/post/:post_id/all', function(req, res, next) {
    let post = dataFetch.posts.getPostById(req.params.post_id);
    post.likes = dataFetch.posts.getLikesByPostId(req.params.post_id);
    post.comments = dataFetch.posts.getCommentsByPostId(req.params.post_id);
    res.json({post});
});

router.get('/post/:post_id/likes', function(req, res, next) {
    res.json({
        postId: req.params.post_id,
        likes: dataFetch.posts.getLikesByPostId(req.params.post_id),
    });
});

router.get('/post/:post_id/comments', function(req, res, next) {
    res.json({
        postId: req.params.post_id,
        comments: dataFetch.posts.getCommentsByPostId(req.params.post_id),
    });
});

router.get('/likes', function(req, res, next) {
  res.json({likes: dataFetch.likes.getAll()});
});

router.get('/like/:like_id', function(req, res, next) {
    res.json({
        like: dataFetch.likes.getLikeById(req.params.like_id),
    });
});

router.get('/comments', function(req, res, next) {
    res.json({
        comments: dataFetch.comments.getAll(),
    });
});

router.get('/comment/:comment_id', function(req, res, next) {
    res.json({
        comment: dataFetch.comments.getCommentById(req.params.comment_id),
    });
});

function updateRanking(post) {
    if (typeof(post) == "number") post = dataFetch.posts.getPostById(post);
    if (post == null) {
        console.error("Can't update ranking of post");
        return;
    }
    let ranking = calculateRanking(post);
    dataFetch.posts.updatePostById(post.id, { ranking })
};


function calculateRanking(post) {
    let postDate = utils.timestampToDate(post.timestamp);
    let days = utils.diffDaysBetweenDates(postDate, new Date());
    let lambda = Math.log(2)/90;
    let baseRanking = 1000 * Math.pow(Math.E, -lambda * days);
    let likes = dataFetch.posts.getLikesByPostId(post.id);
    let likeRankingSum = 0;
    for (let like of likes) {
        let likeDate = utils.timestampToDate(like.timestamp);
        let days = utils.diffDaysBetweenDates(likeDate, new Date());
        let lambda = Math.log(2)/90;
        let likeRanking = 100 * Math.pow(Math.E, -lambda * days);
        likeRankingSum += likeRanking;
    }
    let totalRanking = baseRanking + likeRankingSum;
    return totalRanking;
}

module.exports = router;
