# Feed Service

The main function of the Feed service is to fetch home timeline and profile timeline of users.

<br>

## Database (feed)

> Although noSQL database is used but a proper Schema is maintained.<br>


### ProfileFeedCollection <br>
<br>
This Collection represents the ownership of posts.

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `{userId: ObjectId;postId: ObjectId}` | if a user with id userId has created a post with id postId, this exists (**Primary Key**) |

<br>

## API Reference

Get the timeline feed of the user

```code
  GET /api/feed/
```
Get the profile feed of the user with id userId

```code
  POST /api/feed/:userId
```


<br>


## Handlers
> Handlers consumes events from NATS stream and processes them.
### [PostCreated Handler](/feed/src/handlers/postCreatedHandler.ts)
It consumes the [PostCreatedEvent](../post/README.md#postcreatedevent) and processes it and adds the data to the [ProfileFeedCollection](#profilefeedcollection-) and also fansOut the post.

### [UserFeedStaled Handler](/feed/src/handlers/userFeedStaledHandler.ts)
It consumes the [UserFeedStaledEvent](../user-graph/README.md#userfeedstaledevent) and processes it clears the current timeline cache for the user.

<br>

## Architecture
*(Feed and timeline words are used interchangeably)*
### Using Redis as a timeline feed cache
The user timeline of feed shows the recents posts from people that the user follows and also some of his recent posts. To calculate the user feed, first the followees of the users have to fetched from [UserGraphView service](../user-graph-view) and recent posts of each of them have to be fetched and merged together to create the feed.\
This is very expensive operation and cannot scale for higher no. of users.\
To make it scalabe we have to precalculate the user's feed and store the top 100 recent posts in redis which is used as a timeilne cache.\
There are two ways to precalculate user's feed - **Fanout on Write** and **Fanout on Read**.\
A hybrid of both of these approaches have been used.\
First we have to understand, that most of the users will only view recent posts of their feed and they don't go deeper than top 100 posts, so for top 100 posts we are going to use **Fanout on Write** and for later posts **Fanout on Read**.

#### Fanout on Write
Whenever a user creates a post, a [PostCreatedEvent](../post/README.md#postcreatedevent) is published, this Feed service then consumes this event and fans out (sends) the post to the timeline caches of all the followers of the user that created the post and are stored in those caches.\
\
![image](https://user-images.githubusercontent.com/58662119/205811932-e25a7cb5-da74-4af6-99ca-9e6529a578fa.png)
#### Fanout on Read
If a user views old posts then these are fetched on the fly, posts of all the followees of users are fetched and then combined and the result is returned for the user and appended to that cache.\
\
There is also a ttl(time to live) value on these cached posts so that space is not wasted for users who rarely view their feeds.\
\
![image](https://user-images.githubusercontent.com/58662119/205818608-7a16c6a8-31bb-4e7b-9446-38983bd2347c.png)
### Clearing the staled cache
If a user follows or unfollows another user, then a [UserFeedStaledEvent](../user-graph/README.md#userfeedstaledevent) is published which is then consumed by this Feed service and the timeline cache of this user is cleared and will be automatically updated when the user reads its timelines post or a new post is created which fans out to his timeline.

### Fetching the user feed

Firstly, posts from user's timeline cache are fetched and are shown in the timeline, if a user requests more posts then they are fetched on the the fly (**Fanout on Read**) and then are appended to the cache untill the cache_limit which is top 100 posts are read. \
\
![image](https://user-images.githubusercontent.com/58662119/205831309-eb78c8a2-561e-4d4a-9e6d-12b7997f6ac4.png)

<br>

## Architecture Diagram
![feed](https://user-images.githubusercontent.com/58662119/206220660-b7e1a246-2bf2-496c-82c5-d69e2a49302f.png)