# Post Service

The main function of the Post service is to create and fetch posts of a particular postId and get the total count of posts by a particular user.

<br>

## Database (post)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 


#### TrackCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `string` | trackId of a spotify track  |
| `trackName`      | `string` | name of spotify track  |
| `listenUrl`      | `string` | url of the spotify track  |
| `artists`      | `{artistName: string, artistId: string}[]` | artists of the track  |
| `images`      | `string[]` | url of the album arts  |

<br>

#### PostCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | postId of the post (**Primary Key**) |
| `userId`      | `ObjectId` | userId of the user who made the post  |
| `trackId`      | `string` | trackId of the track which is shared in the post |
<br>

## API Reference

Create a new post and publishes a [PostCreatedEvent]().

```code
  POST /api/post
```
\
Get the no. of posts made by a user with id userId

```code
  GET /api/post/getPostCount:userId
```


\
Returns the count of comments on a post with id postId.

```code
  GET /api/comment/:postId/count
```

<br>

## Events


#### PostCreatedEvent


It is published whenever a new post is created .
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `postId`      | `string` | postId of the created post |
| `userId`      | `string` | userId of the user which created post |

<br>

## Architecture Diagram
![image](https://user-images.githubusercontent.com/58662119/205669246-a61d88b9-5397-4e25-bca6-f367f5dfd81f.png)