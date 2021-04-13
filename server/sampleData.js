const axios = require('axios');
let utils = require('./utils');
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

let randomPosts = [
    'https://i.imgur.com/UmnN6vB.jpeg',
    'https://i.imgur.com/yzHKqSC.jpeg',
    'https://i.imgur.com/Jvh1OQm.jpg',
    'https://i.imgur.com/FHXZI5X.jpeg',
];

let users = [
    {
        id: '1',
        username: 'RobinWieruch',
        pfp_url: getRandomPfp(),
    },
    {
        id: '2',
        username: 'DaveDavids',
        pfp_url: getRandomPfp(),
    },
    {
        id: '3',
        username: 'RonnyRon',
        pfp_url: getRandomPfp(),
    },
    {
        id: '4',
        username: 'LaurieLor',
        pfp_url: getRandomPfp(),
    },
    {
        id: '5',
        username: 'AliAj',
        pfp_url: getRandomPfp(),
    },
];


let fetchUsers = async (amt) => {
    await fetchPostImages(100);
    await fetchCommentMessages(20);

    let chunk = await axios.get('https://randomuser.me/api/?results=' + amt);

    let res = chunk.data.results;
    for (let i = 0; i < amt; ++i) {
        let user = {id: i + 6, username: res[i].login.username, pfp_url: res[i].picture.large};
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
                img_url: getRandomPost()
            };
            postLen++;
            posts.push(post);
            for (let k = 0; k < users.length; ++k) {
                if (Math.random() < .08) {
                    let like = {
                        id: likeLen + 1,
                        user_id: users[k].id,
                        post_id: post.id,
                        timestamp: getRandomTimestamp(),
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
                        timestamp: getRandomTimestamp(),
                    };
                    commentLen++;
                    comments.push(comment);
                }
            }
        }
    }

}
fetchUsers(100);

//https://picsum.photos/v2/list?page=2&limit=100
async function fetchPostImages(amt) {
    let chunk = await axios.get('https://picsum.photos/v2/list?limit=' + amt);

    let res = chunk.data;

    res.forEach((value, i) => {
        randomPosts.push(value.download_url);
    });

}
async function fetchCommentMessages(amt) {
    for (let i = 0; i < amt; ++i) {
        let chunk = await axios.get('https://baconipsum.com/api/?type=all-meat&paras='+amt+'&start-with-lorem=1');
        let data = chunk.data;
        data.forEach((value, i) => {
            randomComments.push(value);
        });
    }
}
let posts = [];
let likes = [];
let follows = [];
let comments = [];
let postLen = 0;
let likeLen = 0;
let followLen = 0;
let commentLen = 0;



/*
let posts = [
    {
        id: '1',
        user_id: '3',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '2',
        user_id: '1',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '3',
        user_id: '1',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '4',
        user_id: '3',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '5',
        user_id: '3',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '6',
        user_id: '2',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '7',
        user_id: '2',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '8',
        user_id: '2',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '9',
        user_id: '2',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
    {
        id: '10',
        user_id: '2',
        img_url: getRandomPost(),
        timestamp: getRandomTimestamp(),
        ranking: 0
    },
];
let likes = [
    {
        id: '1',
        user_id: '2',
        post_id: '1',
        timestamp: getRandomTimestamp()
    },
    {
        id: '2',
        user_id: '3',
        post_id: '1',
        timestamp: getRandomTimestamp()
    },
    {
        id: '3',
        user_id: '4',
        post_id: '1',
        timestamp: getRandomTimestamp()
    },
    {
        id: '4',
        user_id: '4',
        post_id: '3',
        timestamp: getRandomTimestamp()
    },
    {
        id: '5',
        user_id: '5',
        post_id: '3',
        timestamp: getRandomTimestamp()
    },
    {
        id: '6',
        user_id: '6',
        post_id: '6',
        timestamp: getRandomTimestamp()
    }
];

let comments = [
    {
        id: '1',
        user_id: '2',
        post_id: '1',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    },
    {
        id: '2',
        user_id: '3',
        post_id: '1',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    },
    {
        id: '3',
        user_id: '4',
        post_id: '1',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    },
    {
        id: '4',
        user_id: '4',
        post_id: '3',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    },
    {
        id: '5',
        user_id: '5',
        post_id: '3',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    },
    {
        id: '6',
        user_id: '6',
        post_id: '6',
        message: getRandomComment(),
        timestamp: getRandomTimestamp()
    }
];

let follows = [
    {
        id: '1',
        follower_id: '1',
        following_id: '2'
    },
    {
        id: '2',
        follower_id: '1',
        following_id: '3'
    },
    {
        id: '3',
        follower_id: '1',
        following_id: '4'
    },
    {
        id: '4',
        follower_id: '1',
        following_id: '5'
    },
    {
        id: '5',
        follower_id: '2',
        following_id: '5'
    },
    {
        id: '6',
        follower_id: '3',
        following_id: '2'
    },
    {
        id: '7',
        follower_id: '4',
        following_id: '5'
    },
]
*/

module.exports = {
    users, posts, likes, comments, follows
}

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
