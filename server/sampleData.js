let utils = require('./utils');

let users = [
    {
      id: '1',
      username: 'RobinWieruch',
    },
    {
      id: '2',
      username: 'DaveDavids',
    },
    {
      id: '3',
      username: 'RonnyRon',
    },
    {
      id: '4',
      username: 'LaurieLor',
    },
    {
      id: '5',
      username: 'AliAj',
    },
];

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

module.exports = {
    users, posts, likes, comments, follows
}

function getRandomPost() {
    let randomPosts = [
        'https://i.imgur.com/UmnN6vB.jpeg',
        'https://i.imgur.com/yzHKqSC.jpeg',
        'https://i.imgur.com/Jvh1OQm.jpg',
        'https://i.imgur.com/FHXZI5X.jpeg',
    ];
    let randomIndex = Math.trunc(Math.random() * randomPosts.length);
    return randomPosts[randomIndex];
};

function getRandomComment() {
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
    let randomIndex = Math.trunc(Math.random() * randomComments.length);
    return randomComments[randomIndex];
};

// gets a random timestamp from one year ago to right now
function getRandomTimestamp() {
    let date = utils.randomDate(new Date().setFullYear(new Date().getFullYear() - 1), new Date());
    return utils.dateToTimestamp(date);
}
