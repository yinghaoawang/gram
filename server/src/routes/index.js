const express = require('express');
const router = express.Router();
const dataFetch = require('../services/fetchFromCache');
const utils = require('../utils');
const hashing = require('../hashing');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../middleware/auth');
const { check, validatorData } = require('../validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sharp = require('sharp');
const axios = require("axios");
const errObj = require('../err').errObj;

const accessTokenSecret = config.jwt.secret;
const sessionTokenSecret = config.session.secret;
router.use(cookieParser());

const defaultExpireTime = '10h';
const errorFlag = null;

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
        if (req.user != null) {
            let user = await dataFetch.users.getUserById(req.user.id);
            res.status(200).json(user);

        } else res.status(401).json({msg: 'Not logged in'});
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

router.post('/users/logout', async(req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send('Logout successful');
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        if (req.body.user == null) throw new Error('No user post data');
        let userInfo = JSON.parse(req.body.user);
        const { username, password } = userInfo;
        const user = dataFetch.users.getUserByUsername(username);
        let passwordCorrect = false;
        if (user != null) passwordCorrect = await hashing.checkPassword(password, user.hashed_password);

        if (user != null && passwordCorrect) {
            // Generate an access token
            const accessToken = jwt.sign({ id: user.id, username: user.username,  role: user.role }, accessTokenSecret,
                {expiresIn: defaultExpireTime});
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
            console.log(validatorData.msg);
            res.statusMessage = validatorData.msg; 

            res.status(401).send();
            return;
        }
        if (user == null) {
            if (errObj.err != null && errObj.err.code == 23505) {
                console.log(errObj.err);
                if (errObj.err.constraint.includes('email')) res.statusMessage = "Email already exists";
                else if (errObj.err.constraint.includes('username')) res.statusMessage = "Username already exists";
                else res.statusMessage = "A field submitted is not unique in the database"
            }
            res.status(401).send();
            return;
        }
        const accessToken = jwt.sign({ id: user.id, username: user.username,  role: user.role }, accessTokenSecret,
            {expiresIn: defaultExpireTime});
        res.cookie('token', accessToken, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({token: accessToken});
    } catch (err) {
        res.statusMessage = err.message;
        res.status(500).send();
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
    } else if (req.query.follower_id != null) {
        posts = dataFetch.posts.getPostsByFollowerId(req.query.follower_id);
    } else {
        posts = dataFetch.posts.getAll();
    }
    posts.map((post) => updateRanking(post));
    res.json({posts});

});

router.post('/posts/create', async function(req, res, next) {
    try {
        if (req.user == null) {
            res.status(401).send('Need user to be logged in to create post');
        } else {
            let {image_base64, description} = req.body;
            let parts = image_base64.split(';');
            let mimType = parts[0].split(':')[1];
            let imageData = parts[1].split(',')[1];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (!validImageTypes.includes(mimType)) {
               throw new Error("invalid file type: " + mimType);
            }
            let img = new Buffer(imageData, 'base64');

            let resizedImageBuffer = await sharp(img).resize({width: 600})
                .jpeg()
                .toBuffer();

            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;

            let url = 'https://api.cloudinary.com/v1_1/'+config.cloud.name+'/image/upload';
            let formData = {
                "upload_preset": config.cloud.uploadPreset,
                "file": resizedBase64
            };

            try {
                let result = await axios.post(url, formData);
                let postData = {
                    user_id: req.user.id, img_url: result.data.secure_url, description
                };
                let post = await dataFetch.posts.addPost(postData);
                res.status(200).json({post});
            } catch(error) {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                throw new Error(error);
            }


            /*
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
             */

        }
    } catch (e) {
        // console.log(e);
        res.status(500).send(e.message);
    }
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
    }  else {
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
            res.status(200).json({comment});
        } else {
            res.statusMessage = "Unable to create like";
            res.status(401).send('')
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

router.get('/follows/', function(req, res, next) {
    try {
        let follows = {};
        if (req.query.id != null) {
            follows = dataFetch.follows.getFollows({id: req.query.id});
        } else if (req.query.follower_id != null && req.query.following_id != null) {
            follows = dataFetch.follows.getFollows({follower_id: req.query.follower_id, following_id: req.query.following_id});
        } else {
            follows = dataFetch.follows.getAll();
        }

        if (follows) {
            res.status(200).json({follows});
        } else {
            res.status(401).send("Unable to get follows")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.post('/follows/create', async function(req, res, next) {
    try {
        if (req.body.follow == null) throw new Error('No follow data');
        let followInfo = JSON.parse(req.body.follow);
        let {follower_id, following_id} = followInfo;
        let follow = null;
        if (Number.isInteger(follower_id) && Number.isInteger(following_id)) {
            let followExists = await dataFetch.follows.getFollows(followInfo);
            console.log('follow exists:' + JSON.stringify(followExists));
            if (followExists && followExists.length == 0) follow = await dataFetch.follows.addFollow(followInfo);
        }
        if (follow) {
            res.status(200).json({follow});
        } else {
            res.status(401).send("Unable to create follow")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.delete('/follows/delete', async function(req, res, next) {
    try {
        if (req.body.follow == null) throw new Error('No like post data');
        let followInfo = JSON.parse(req.body.follow);
        let {follower_id, following_id} = followInfo;
        let follow = null;
        if (Number.isInteger(follower_id) && Number.isInteger(following_id)) {
            follow = await dataFetch.follows.removeFollow(followInfo);
        }
        if (follow) {
            res.status(200).json({follow});
        } else {
            res.status(401).send("Unable to delete follow")
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.get('/followers/', function(req, res, next) {
    try {
        let followers = {};
        if (req.query.user_id != null) {
            followers = dataFetch.follows.getFollowersByUserId(req.query.user_id);
        } else {
            followers = dataFetch.follows.getAll();
        }
        res.json({
            followers
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

router.get('/following/', function(req, res, next) {
    try {
        let following = {};
        if (req.query.user_id) {
            following = dataFetch.follows.getFollowingByUserId(req.query.user_id);
        } else {
            following = dataFetch.follows.getAll();
        }
        res.json({
            following
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

function updateRanking(post) {
    if (typeof(post) == "number") post = dataFetch.posts.getPostById(post);
    if (post == null) {
        console.error("Can't update ranking of post");
        return;
    }
    let ranking = calculateRanking(post);
    //console.log('ranking' + ranking);
    dataFetch.posts.updatePostById(post.id, { ranking })
};


function calculateRanking(post) {
    let postDate = utils.timestampToDate(post.created_at);
    let days = utils.diffDaysBetweenDates(postDate, new Date());
    let lambda = Math.log(2)/90;
    let baseRanking = 1000 * Math.pow(Math.E, -lambda * days);
    let likes = dataFetch.likes.getLikesByPostId(post.id);
    let likeRankingSum = 0;
    for (let like of likes) {
        let likeDate = utils.timestampToDate(like.created_at);
        let days = utils.diffDaysBetweenDates(likeDate, new Date());
        let lambda = Math.log(2)/90;
        let likeRanking = 8 * Math.pow(Math.E, -lambda * days);
        likeRankingSum += likeRanking;
    }
    let totalRanking = Math.floor(baseRanking + likeRankingSum);
    return totalRanking;
}

module.exports = router;

