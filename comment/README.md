# Comment Service

The main function of the Comment service is to create and fetch comments of a post and the count of comments.

<br>

## Database (comment)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 


### ValidPostCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | postId of a valid Post (**Primary Key**) |
<br>

### CommentCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | commentId of the comment (**Primary Key**) |
| `postId`      | `ObjectId` | postId of the post on which comment is made |
| `userId`      | `ObjectId` | userId of the user who made the comment  |
| `text`      | `string` | the content of the comment |
<br>

## API Reference

Create a new comment on post with id postId and publishes a [CommentCreatedEvent](#commentcreatedevent).

```code
  POST /api/comment/:postId
```
\
Get the comments on a post with id postId

```code
  POST /api/comment/:postId?anchorId=
```
| Query Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `anchorId` | `string` | The returned commentsId should be greater than anchorId. (pagination) |

\
Returns the count of comments on a post with id postId.

```code
  GET /api/comment/:postId/count
```
\
Gets the current user

```code
  POST /api/auth/currentUser
```
<br>

## Events


### CommentCreatedEvent


It is fired whenever a new comment is created .
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `commentId`      | `string` | _id field of a valid [CommentCollection](#commentcollection-) document |

## Handlers
> Handlers consumes events from NATS stream and processes them.
### [PostCreated Handler](/comment/src/handlers/postCreatedHandler.ts)
It captures the [PostCreatedEvent](../post/README.md#postcreatedevent) and processes it and add the postId to the _id field of the [ValidPostCollection](#validpostcollection-) .

<br>

## Architecture Diagram
![comment](https://user-images.githubusercontent.com/58662119/206143626-ccd59e53-0e74-42e5-aeb0-3a0c7d2ee765.png)