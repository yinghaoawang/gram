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
                {expiresIn: '10h'});
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

router.get('/posts', function(req, res, next) {
    let posts = {};
    if (req.query.user_id) {
        posts = dataFetch.posts.getPostsByUserId(req.query.user_id);
    } else {
        posts = dataFetch.posts.getAll();
    }
    posts.map((post) => updateRanking(post));
    res.json({posts});

});

router.get('/post/:post_id', function(req, res, next) {
    let post = dataFetch.posts.getPostById(req.params.post_id);
    updateRanking(post);
    res.json({post});
});

router.get('/likes', function(req, res, next) {
    let likes = {};
    if (req.query.user_id != null) {
        likes = dataFetch.likes.getLikesByUserId(req.query.user_id);
    } else if (req.query.post_id != null) {
        likes = dataFetch.likes.getLikesByPostId(req.query.post_id)
    } else {
        dataFetch.likes.getAll();
    }
    res.json({likes});
});

router.get('/like/:like_id', function(req, res, next) {
    res.json({
        like: dataFetch.likes.getLikeById(req.params.like_id),
    });
});

router.post('/likes/create', async function(req, res, next) {
    try {
        if (req.body.like == null) throw new Error('No like post data');
        let likeInfo = JSON.parse(req.body.like);
        let {user_id, post_id} = likeInfo;
        let like = null;
        if (Number.isInteger(user_id) && Number.isInteger(post_id)) {
            let likeExists = await dataFetch.likes.getLikes(likeInfo);
            console.log('like exists:' + JSON.stringify(likeExists));
            if (likeExists && likeExists.length == 0) like = await dataFetch.likes.addLike(likeInfo);
        }
        if (like) {
            res.status(200).json({like});
        } else {
            res.status(401).send("Unable to create like")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.delete('/likes/delete', async function(req, res, next) {
    try {
        if (req.body.like == null) throw new Error('No like post data');
        let likeInfo = JSON.parse(req.body.like);
        let {id} = likeInfo;
        let like = null;
        if (Number.isInteger(id)) {
            like = await dataFetch.likes.removeLike(likeInfo);
        }
        if (like) {
            console.log(like);
            res.status(200).json({like});
        } else {
            res.status(401).send("Unable to delete like")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});


router.get('/comments', function(req, res, next) {
    let comments = {};
    if (req.query.user_id != null) {
        comments = dataFetch.comments.getCommentsByUserId(req.query.user_id)
    } else if (req.query.post_id != null) {
        comments = dataFetch.comments.getCommentsByPostId(req.query.post_id)
    } else {
        comments = dataFetch.comments.getAll();
    }
    comments.sort((a,b) => a.created_at - b.created_at);
    res.json({
        comments
    });
});

router.post('/comments/create', async function(req, res, next) {
    try {
        if (req.body.comment == null) throw new Error('No comment data');
        let commentInfo = JSON.parse(req.body.comment);
        let {user_id, post_id, message} = commentInfo;
        let comment = null;
        if (Number.isInteger(user_id) && Number.isInteger(post_id)) {
            comment = await dataFetch.comments.addComment(commentInfo);
        }
        if (comment) {
            console.log(comment);
            res.status(200).json({comment});
        } else {
            res.status(401).send("Unable to create like")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.get('/comment/:comment_id', function(req, res, next) {
    res.json({
        comment: dataFetch.comments.getCommentById(req.params.comment_id),
    });
});

router.get('/followers/', function(req, res, next) {
    let followers = {};
    if (req.query.user_id != null) {
        followers = dataFetch.follows.getFollowersByUserId(req.query.user_id);
    } else {
        followers = dataFetch.follows.getAll();
    }
    res.json({
        followers
    });
});

router.get('/following/', function(req, res, next) {
    let following = {};
    if (req.query.user_id) {
        following = dataFetch.follows.getFollowingByUserId(req.query.user_id);
    } else {
        following = dataFetch.follows.getAll();
    }
    res.json({
        following
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
    let likes = dataFetch.likes.getLikesByPostId(post.id);
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

