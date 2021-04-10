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

##### 404 page
I didn't have a route for the root page, so react didn't even render a "content" to push my footer to the bottom. I could just make a home page, but the footer still
wouldn't sink to the bottom if I entered a wrong route. So I decided to make a 404 page next.