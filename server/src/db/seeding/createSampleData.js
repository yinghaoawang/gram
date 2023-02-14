const fs = require('fs');
const path = require('path');
const axios = require('axios');
let utils = require('../../utils');
let hashing = require('../../hashing');
let randomComments = [
    `The year is 3169. An excavation is taking place on earth, the old home of mankind. 3 devices called per[unreadable] computers were found.
    [POSSIBLE EXPLOSIVE] No AMSX ports, at least 1200 years old. You power it up using an adapter you found.
    You see a 2D screen . There are a lot of scripts with old English and incomprehensible symbols.
    You click to the first symbol. You encounter a face that looks like it is...making fun of you?
    As you scroll you see this creature committing horrible crimes,with the exact same smug face.
    You translate a text and it roughly says \"I hate the negative lord\". You translate the others too.
    All of them say the same thing. As you look at the screen,you feel like it is staring at you too.
    You hate the antichrist. You hate the antichrist. You hate the antichrist.`,
    'Great post!',
    'Keep up the good work buddy',
    'Hey sexy, call 8498462037 for a good time',
    'Sciatica, does anyone know how to fix it?',
    'go to dunboost.net',
    'DOINB RYZE HACK？英雄联盟 400 CS 24 MIN DOINB RYZE HACK？英雄联盟 400 CS 24 MIN DOINB RYZE HACK？英雄联盟',
    'slumlord',
];

randomComments.forEach(comment => comment.substring(0,255));

let randomPosts = [
    'https://i.imgur.com/UmnN6vB.jpeg',
    'https://i.imgur.com/yzHKqSC.jpeg',
    'https://i.imgur.com/Jvh1OQm.jpg',
    'https://i.imgur.com/FHXZI5X.jpeg',
];

let users = [
    {
        id: 1,
        username: 'alan',
        email: 'alan@gmail.com',
        role: 'admin',
        pfp_url: getRandomPfp(),
        created_at: getRandomTimestamp(),
    },
    {
        id: 2,
        username: 'dave',
        email: 'dave@gmail.com',
        pfp_url: getRandomPfp(),
        created_at: getRandomTimestamp(),
    },
    {
        id: 3,
        username: 'RonnyRon',
        pfp_url: getRandomPfp(),
        created_at: getRandomTimestamp(),
    },
    {
        id: 4,
        username: 'LaurieLor',
        pfp_url: getRandomPfp(),
        created_at: getRandomTimestamp(),
    },
    {
        id: 5,
        username: 'AliAj',
        pfp_url: getRandomPfp(),
        created_at: getRandomTimestamp(),
    },
];


let beginFetch = async (amt) => {
    await fetchPostImages(100);
    await fetchCommentMessages(20);

    for (let i = 0; i < users.length; ++i) {
        users[i].hashed_password = await hashing.hashPassword('password');
    }

    let chunk = await axios.get('https://randomuser.me/api/?results=' + amt);

    let res = chunk.data.results;
    for (let i = users.length + 1; i < amt; ++i) {
        let user = {id: i, username: res[i].login.username, pfp_url: res[i].picture.large, created_at: getRandomTimestamp()};
        user.email = res[i].email;
        user.hashed_password = await hashing.hashPassword(res[i].login.password);
        if (Math.random() > .75) {
            let r = Math.random();
            if (r > .25) user.nickname = res[i].name.last;
            else if (r > .5) user.nickname = res[i].location.street.name;
            else if (r > .75) user.nickname = res[i].location.country;
            else user.nickname = res[i].name.first;
        }
        if (Math.random() > .55) {
            user.group = res[i].location.city;
        }
        if (Math.random() > .1) {
            let sliceIndex = -1;
            user.description = getRandomComment();
            if (user.description.indexOf('.') > 0) {
                sliceIndex = user.description.indexOf('.');
            }
            if (Math.random() > .5) {
                if (user.description.indexOf('.', sliceIndex + 1) > 0) sliceIndex = user.description.indexOf('.', sliceIndex + 1);
                if (Math.random() > .5) {
                    if (user.description.indexOf('.', sliceIndex + 1) > 0) sliceIndex = user.description.indexOf('.', sliceIndex + 1);
                }
            }
            if (sliceIndex > 0) {
                user.description = user.description.slice(0, sliceIndex + 1);
            }
        }
        users.push(user);
    }
    for (let i = 0; i < users.length; ++i) {
        let user = users[i];
        for (let j = 0; j < users.length; ++j) {
            if (i == j) continue;

            if (Math.random() > .55) {
                let follow = {
                    id: followLen,
                    follower_id: user.id,
                    following_id: users[j].id,
                    created_at: getRandomTimestamp(),
                }
                follows.push(follow);
                followLen++;
            }
        }
        //console.log(follows);

        let postCount = Math.trunc(Math.random() * Math.random() * Math.random() * 40);
        for (let j = 0; j < postCount; ++j) {
            let post = {
                id: postLen + 1,
                user_id: user.id,
                img_url: getRandomPost(),
                created_at: getRandomTimestamp(),
            };
            postLen++;
            posts.push(post);
            for (let k = 0; k < users.length; ++k) {
                if (Math.random() < .08) {
                    let like = {
                        id: likeLen + 1,
                        user_id: users[k].id,
                        post_id: post.id,
                        created_at: getRandomTimestamp(),
                    };
                    likeLen++;
                    likes.push(like);
                }
            }
            for (let k = 0; k < users.length; ++k) {
                if (Math.random() < .05) {
                    let comment = {
                        id: commentLen + 1,
                        user_id: users[k].id,
                        post_id: post.id,
                        message: getRandomComment(),
                        created_at: getRandomTimestamp(),
                    };
                    commentLen++;
                    comments.push(comment);
                }
            }
        }
    }

}
//https://picsum.photos/v2/list?page=2&limit=100
async function fetchPostImages(amt) {
    for (let i = 0; i < amt; i++) {
        let download_url = 'https://picsum.photos/id/' + (i + 1) + '/600/400/';
        randomPosts.push(download_url);
    }
    
    // let chunk = await axios.get('https://picsum.photos/v2/list?limit=' + amt);
    // let res = chunk.data;

    // res.forEach((value, i) => {
        // randomPosts.push(value.download_url);
    // });

}
async function fetchCommentMessages(amt) {
    for (let i = 0; i < amt; ++i) {
        let chunk = await axios.get('https://baconipsum.com/api/?type=all-meat&paras='+amt+'&start-with-lorem=1');
        let data = chunk.data;
        data.forEach((value, i) => {
            value = value.substring(0, 255);
            randomComments.push(value);
        });
    }
}
let posts = [], likes = [], follows = [], comments = [];
let postLen = 0, likeLen = 0, followLen = 0, commentLen = 0;
/*
module.exports = {
    users, posts, likes, comments, follows
};
*/

function getRandomPfp() {
    let randomPfps = [
        'https://techcrunch.com/wp-content/uploads/2015/09/11667534_10102203860243201_2713296330820668368_n.jpg?w=528',
        'https://i.pinimg.com/originals/7d/1a/3f/7d1a3f77eee9f34782c6f88e97a6c888.jpg',
        'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
        'https://www.dailymoss.com/wp-content/uploads/2019/08/funny-profile-pic59.jpg',
        'https://brandyourself.com/blog/wp-content/uploads/linkedin-profile-picture-tips.png',
        'https://brandyourself.com/blog/wp-content/uploads/what-is-thought-leadership.png',
    ];
    let randomIndex = Math.trunc(Math.random() * randomPfps.length);
    return randomPfps[randomIndex];

}

function getRandomPost() {
    let randomIndex = Math.trunc(Math.random() * randomPosts.length);
    return randomPosts[randomIndex];
};

function getRandomComment() {
    let randomIndex = Math.trunc(Math.random() * randomComments.length);
    return randomComments[randomIndex];
};

// gets a random timestamp from one year ago to right now
function getRandomTimestamp() {
    let date = utils.randomDate(new Date().setFullYear(new Date().getFullYear() - 1), new Date());
    return utils.dateToTimestamp(date);
}

/* Begin fetching data */

beginFetch(100).then(() => {
    let jsonData = {
        users,
        posts,
        likes,
        comments,
        follows
    };
    jsonData = JSON.stringify(jsonData, null, 2);
    let file = path.join(__dirname, '/sampleData.json');
    fs.writeFileSync(file, jsonData);
});

