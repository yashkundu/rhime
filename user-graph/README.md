# UserGraph Service

The main function of the UserGraph service is to create and fetch comments of a post and the count of comments.

<br>

## Database (userGraph)

> Although noSQL database is used but a proper Schema is maintained.<br>

<br>


### ValidUserCollection <br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | userId of a valid user (**Primary Key**) |
| `minionCount`      | `Int32` | the no. of followers of the user |
| `messiahCount`      | `Int32` | the no. of accounts the user follows |
<br>

### MinionCollection <br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `minionId`      | `ObjectId` | userId of the user which follows |
| `messiahId`      | `ObjectId` | userId of the user which is being followed |


<br>

### MessiahCollection <br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `messiahId`      | `ObjectId` | userId of the user which is being followed |
| `minionId`      | `ObjectId` | userId of the user which follows |

<br>

## API Reference

Toggle the relation of current user with the user with id userId. Follows changes into not following, & not following changes into following.

```code
  POST /api/userGraph/:userId/toggleUser
```
\
Get the no. of followers of user with id userId

```code
  GET /api/userGraph/:userId/minionCount
```
\
Get the no. of followees of a user with id userId

```code
  GET /api/userGraph/:userId/messiahCount
```
\
Get the followers of a user with id userId

```code
  GET /api/userGraph/:userId/minions
```

| Query Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `anchorId` | `string` | The returned follower's userId should be greater than anchorId. (pagination) |

\
Get the followees of a user with id userId

```code
  POST /api/userGraph/:userId/messiahs
```

| Query Param | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `anchorId` | `string` | The returned followee's userId should be greater than anchorId. (pagination) |

\
Checks if the user with id userId is a follower of current user or not.

```code
  GET /api/userGraph/:userId/isMinion
```
\
Checks if the user with id userId is a followee of currentUser

```code
  POST /api/userGraph/:userId/isMessiah
```
<br>

## Events


### UserFeedStaledEvent
It published when a user follows or unfollows another user.
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `userId`      | `string` | userId of the user which followed or unfollowed any user |

## Handlers
> Handlers consumes events from NATS stream and processes them.
### [UserCreated Handler](/user-graph/src/handlers/userCreatedHandler.ts)
It captures the [UserCreatedEvent](../auth/README.md#usercreatedevent) and processes it and initializes a document for that user in [ValidUserCollection](#validusercollection-) .

<br>

## Architecture Diagram
![userGraphImage](https://user-images.githubusercontent.com/58662119/205866297-512caecc-eded-4104-a4a0-13a424a7e452.jpg)