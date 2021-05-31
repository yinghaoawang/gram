# Intro
I tend to lose track of what I'm doing, make no progress, then quit whatever I'm doing.
I decided that if I write down the steps to create a project, then I will be more focused, and hopefully not lose track.

# Tools
I want to use as little tools as possible. This lets me learn more about the different ways I can build different modules and
how public modules might work. I also get more pride and joy out of building things myself.

So the packages I'll use are:
- Express
- React

#### Apologies in advance
I sometimes interchange stories and posts, and likes and upvotes. Just think of their concept when I mention it as these principles
should apply to most/all social media platforms.

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
The future value of a vote's power can be determined by N=Nnot\*e^(-lambda\*t)

#### 1.03 When to update rank of a post
Another question posed is whether I should store the rank of post or calculate it every time it's needed to.
[Post](https://stackoverflow.com/questions/12672349/how-can-i-store-post-rankings-that-change-with-time)
says that it's ok to just store it on every calculation, or keep track of the last time it was recalculated, and only update every X minutes (20 is good).


#### 1.1 Create base server
Gonna setup restful api for users, posts, likes, comments, followers, and followings.
Users own Posts, Likes, Comments, Followers, Followings
Posts own Likes, Comments

Put file with helper functions ('utils') in node_modules

Could use dotenv but deciding to make my own eventually (not rn)

Generated relatively random data with small pool of random post images and comments

I guess it's time to add the ranking algorithm now

#### 1.2 Ranking Algorithm
Since I have a post, its timestamp, all its likes, and all the likes' timestamps, I should be able to use the ordinal
ranking algorithm.

I think I should have a decaying base value for existing, and then decaying values for their likes as well.	

First things first, I should assign the rank based on how long ago it was created. 
The lambda value is found with ln 2 = lambda\*(halflife).
If I want a posts value to halve after a week, then lambda = ln 2 / 7.
The formula again for decay is Nt=Nnot\*e^(-lambda\*t)

I used 1000 as the base value for a post, and the half life to 3 months because the generated likes I have ranges from 0-1 year.
For likes, I used 100, and half life to 3 months too. That way 10 likes recently should match the popularity of a new post.

I could limit the ranking updates to only every 20 minutes, but I decided it wasn't necessary.

Thoughts to self: When I do have user authentication, maybe I reduce the ranking of random posts or enhance the ranking of following (and even follower) posts.
If I don't do any of that, then maybe I just filter out non-following stories

#### 1.29 Follows
I didn't actually finish 1.1 because I still had yet to implement followers/following. Turns out I just needed one relational table because it's a many to many
relationship. So it's just called follows that has a follower_id and a following_id.

#### 1.3

##### Base structure
Okay, the server making was pretty smooth. Took longer than I thought, but I wanted to make sure it was clean. Refactored a few times while writing it.
It's going to be a pain in the ass both learning to use React and actually trying to make it look nice as well as writing in the best practices.

To continue the trend of making things from scratch, I've decided to bootstrap React without using create-react-app. It just creates a lot of random files.
After: By god, it took me over 4 hours just fixing bugs setting up React with webpack and babel. And it doesn't throw bugs as well as create-react-app, oh well.

Now I'm gonna send a request to my server and have it print out user data. Learned that setState doesn't happen synchronously. 
I tried fetching user data from the server, but I ran into cors. Fixed it by making a cors middleware whitelisting the react website.
Got the users page to display users and their posts


##### Navbar
Found a lot of clunky css code with js to make a sticky navbar, but found a 3 line css that could make it sticky. 

##### Making user profile page
I spent about 1 and a half (highkey halfass) days building the ui on adobe xd. It was actually very fun, and it let me envision a product that I would be proud
to build.

It took an extremely long time making the layout for this page. The data was easy enough to fetch from the server, but making everything align like I wanted to
took a hot minute. Using pure css definitely takes some getting used to, but I think it's a strong tool to have. I think it'll help me understand the underlying
workings of css frameworks like bootstrap and material better.

##### Footer
This was trickier than I thought. Making centered divs and links was easy, but making it stay at the bottom IFF there is not enough content on the page was hard.
I ended up using min-height, which forced me to have the div of every component named "content". Makes the codebase more rigid, but I didn't want to waste more time
on it.

Added a bunch of links to make the footer look better. I built the "Top Accounts" page by changing the users page to just list all the users. I'm gonna have to make
a ranking system for the users in the future.

##### 404 page
I didn't have a route for the root page, so react didn't even render a "content" to push my footer to the bottom. I could just make a home page, but the footer still
wouldn't sink to the bottom if I entered a wrong route. So I decided to make a 404 page next.

Starting to get burnt out, maybe I should get more features done.

### Rethinking MVP
#### Frontend posts details
I just said the frontend should look smooth, but I didn't think about how much features it would take to make it look nice.
There would need to be a detailed post page with likes, comments, author details, and more. Clicking on posts on the home, explore,
and profile page would all lead to opening up a floating page of that where if I click off of it, it takes me back to the original
page (not really because I never really left the original page. That's gonna take a lot of work, but I do think it's important to have
in the MVP. 

#### Ranking system revisited
The users are going to need a ranking system too. I was thinking it was needed for the explore page, but I think I can just put posts on that page
sorted by ranking in desc. 

The main thing for adding a user ranking system is suggestions for follows. Firstly, high ranking users are more likely to appear as suggestions, especially
if you aren't following anybody. Then there might also be the need for an algorithm to see what are some
follow (friend) suggestion algorithm (distance, etc. i'll have to do some research, but most likely not put this in the MVP).

Did a bit of reserach. It's the users that you interact most with that show up more on your feed. So liking, commenting, even viewing for a long time will add
points to their personal ranking towards you. Furthermore, if a post is relevant to your interests or search history, then it will also increase its chances
to appear on your feed, as well as the user appearing in your suggestions.

I'd need a way to categorize all posts, users, and a whole bunch of stuff. Definitely won't put anything too advanced in the MVP.

#### Notifications and account/auth

##### User Auth
Very big feature, I think it's a must-have. Guests can register, users can create posts, like, and comment. They have their own personalized feed, it's gonna be
simple at the start though.

##### Notifications
I think this feature is quite important. If a user likes your stuff, follows you, then you should get a notification. Gonna need tables for notifications of types.
If it's read, then 

##### Messaging
Once user auth is implemented, it shouldn't be too hard, but the optimization might be a problem. Can deal with optimization later. Messaging should be fine for the MVP.

##### Consensus
I think we put all of these in the MVP

#### Admin page
Ability to suspend/delete posts, read reports (need to create reports too), suspend/delete users. Not sure if put in MVP, play it by ear.

#### Overview
1. Make a post page overlay
2. User authentication
3. Notifications for each user
4. User to user relationship table for more ranking in feed
5. User to user messaging, increases relationship points

### 1.4
#### Generating more random data
First I decided to generate more random data and images, so I got random api image data from randomuser.me, and I got random image data from another api site for the posts.
I also decided to randomly generate relationships for likes, 

First thing I noticed is that loading large amount of high res images on a page is really slow. I'd want to speed it up, and a solution on the top of my head is to create a
low res copy of a user uploaded file and have that show on the profile, and then it gets the high res photo when clicked on. I think this solution is good enough, and I won't
do further research on this.

I was also thinking about generating data where it simulates actual people and friends (clusters and friendships based on location, interests, mutuals, etc. basically likelihood
to be friends/meet), but it would take too long, and I'm too dumb atm to do it in a timely manner as I'm trying to finish this so I can put it on my resume to get a job.
Maybe i'll do something like this in the distant future.

##### Using postgreSQL
I was debating on creating the post modal or setting up and using a relationsl db on the server. I decided I should use db because I already started generating better random data,
so storing the seed data into the db would be good. More importantly, it's more efficient to use data provided by db joins before I work on more front end pages that require fetching
specific cross relational data from the server.

I decided on a relational db rather than a NoSQL db because I read that relational is better for systems that have more relationships. Since the updates are common, and have
many relationships, they would take longer on NoSQL than a relational model.

First of all, I want to clean up the code on the server. I use business logic in the controllers. I'm gonna add models, and services to the server as read about
[here](https://softwareontheroad.com/ideal-nodejs-project-structure/). After: I realized that I already kinda separated the business logic mostly into a service.
I also feel like writing model classes would be redundant, so **I decided not to do that** either.

##### Read through caching
Took longer than I wanted to, but I finally stored the generated data onto the database. I created a cache file on the server, and the cache first gets all the data from the db.
And the server just gets data from the cache.  I did this cus fetching from the server would be faster than fetching from the database... or would it... Found info on what I did
[here](https://blog.bluzelle.com/things-you-should-know-about-database-caching-2e8451656c2d). I'm not sure what category would my version be. Ig it'll just first synchronize data
with the server on first load, and then each modification would go through the cache first, and then the changes made to the cache are made to the database immediately (write through).

##### Registration
So I realized that to continue with the write through caching, I needed to update the cache per insertion action, and then run the db query after. So I decided that making a registration
page on the frontend, and some user creation on the backend.

Took me a bit to make the registration on the frontend. Wasn't very tricky, just ran into some weird css problems, and used some hacks. Margin-top works weird with min-height, so
I just made an empty div with the height of a margin of wanted, and it acted as a margin.

I spent a long ass time figuring out how to make it so that react actually refreshes every time I modify a css file (when webpack is serving it only recompiles one time after I modify a
CSS file, and all subsequent times, there are like no changes). I spent a good amount of hours trying to figure out what's wrong, and eventually adding the line "cache: false" fixed
the issue.

##### Authorization tokens
First I used the jsonwebtoken package to generate json web tokens for authentication. I also used bcrypt to hash the passwords. 

Then I added middleware to check authorization headers. Also, I added my own validation functions for user creation. Spent a while doing that.

Then I made it so that an http-only cookie is stored on the client after the client logs in or signs up (the http-only cookie is for preventing CSRF attacks). I needed to use a cookie
parser to modify my middleware to read cookies from the client. In order to set cookies on the client, I also had to make sure that the client and the server are on the same domain-
this should be not too hard in production, and in development I had to modify the webpack config to proxy requests to the server. All of this took a lot longer than I thought it would,
I definitely took for granted create-react-app since it makes proxying a lot less confusing.

So in order to use http-only cookies, I decided to get the user by going to a route on the api on every page to check if the user is logged in. So I go to /api/user/me on every route
change, and it sets the global user in UserAuth. 

I also added a spinner loading thing for when a user profile is loading since it takes a while.