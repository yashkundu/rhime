# Like Service

The main function of the Like service is to toggle likes on a post or comment and to fetch if a particular user has like the post or not.

<br>

## Database (like)

> Although noSQL database is used but a proper Schema is maintained.<br>


<br>

### ValidItemCollection <br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | id of a valid item (a post or comment) (**Primary Key**) |
<br>

### ItemLikeCollection <br>
It provides the persistent storage for likes in the application.

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `{itemId: ObjectId, userId: ObjectId}` | this exists if a user with id userId has liked an item (post or comment) with id itemId |

<br>

## API Reference

Toggles the like of current user on item with id itemId.

```code
  POST /api/like/:itemId
```
\
Get if the current user has liked the item with id itemId or not.

```code
  Get /api/like/:postId?anchorId=
```

<br>

## Events


### LikeToggledEvent


It is published whenever a user toggle a like on an item so that likes can be update asynchronously.
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `itemId`      | `string` | id of the item  |
| `userId`      | `string` | id of the user  |
| `type`      | `number` | 1 - the user has like, -1 - the user has unliked  |
| `eventId`      | `string` | a guid which prevents multiple execution of event handlers  |

<br>

## EventHandlers
> Handlers consumes events from NATS stream and processes them.
### [PostCreated EventHandler](/like/src/handlers/postCreatedHandler.ts)
It captures the [PostCreatedEvent](../post/README.md#postcreatedevent) and processes it and add the postId to the _id field of the [ValidItemCollection](#validitemcollection-) .

<br>

### [CommentCreated EventHandler](/like/src/handlers/commentCreatedHandler.ts)
It captures the [CommentCreatedEvent](../comment/README.md#commentcreatedevent) and processes it and add the commentId to the _id field of the [ValidItemCollection](#validitemcollection-) .

<br>

## Architecture

### Updating likes asynchronously
[ItemLikeCollection](#itemlikecollection-) is where the likes are stored persistently, but likes occur at a very high volume in social media site, and should be efficiencty handled otherwise they will become the bottleneck for the server. If we synchronously update the [ItemLikeCollection](#itemlikecollection-) whenever a like or unlike occurs, it would be highly inefficient, so we can **asynchronously** update the likes in the persistent storage. This can be done by publishing [LikeToggledEvent](#liketoggledevent) to the nats stream and it will be asynchronously handled by  [likeUpdaterService](../like-updater) & [likeBatchUpdaterService](../like-batch-updater).

### Problem with the above approach
If we update likes asynchronously, then it can take some time for them to be updated in the [ItemLikeCollection](#itemlikecollection-). So, sometimes the user won't be able to see the like on the item which it recently liked. To counter this problem we can store the user's likes in the last 5 minutes in an inmemory cache in Redis.\
So whenever a user sends a request to check if it has liked an item, first the inmemory cache will be checked and then the persistent storage.

<br>

## Architecture Diagram
![like](https://user-images.githubusercontent.com/58662119/205961616-fb629156-4fb1-4d47-b3cb-99af8589844d.png)