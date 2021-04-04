# Intro
I tend to lose track of what I'm doing, make no progress, then quit whatever I'm doing.
I decided that if I write down the steps to create a project, then I will be more focused, and hopefully not lose track.

# Tools
I want to use as little tools as possible. This lets me learn more about the different ways I can build different modules and
how public modules might work. I also get more pride and joy out of building things myself.

So the packages I'll use are:
- Express
- React

# 1. Base
### Server
Api calls, send data of users, posts, likes, comments, follower, following, etc.
### Client
Probably gonna spend a lot of time on this. Make it look real nice and smooth, infinite scrolling, and just seamless navigation.
### MVP
Maybe no user auth, just gonna create a viewing platform for guests. Infinite scrolling for sure and browsing profiles.
Need to do some research on what to display on guest's feed.

#### 1.01 Research feed ranking system algorithm
Facebook uses machine learning (fuck).
Found an algorithm on ordinal ranking [here](https://datagenetics.com/blog/october32018/index.html).
The rank value of a post is based on the time of each like (the older, the less value it has). Like a decaying vote.

#### 1.02 Algorithm for feed ranking system
The future value of a vote's power can be determined by N=Nnot\*e^(lambda\*t)

#### 1.03 When to update rank of a post
Another question posed is whether I should store the rank of post or calculate it every time it's needed to.
[Post](https://stackoverflow.com/questions/12672349/how-can-i-store-post-rankings-that-change-with-time)
says that it's ok to just store it on every calculation, or keep track of the last time it was recalculated, and only update every X minutes (20 is good).


#### 1.1 Create base server
Gonna setup restful api for users, posts, likes, comments, followers, and followings.
Users own Posts, Likes, Comments, Followers, Followings
Posts own Likes, Comments

#### 1.2 Seeding with random data
