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
### [UserCreated Handler](/comment/src/handlers/postCreatedHandler.ts)
It captures the [UserCreatedEvent]() and processes it and initializes a document for that user in [ValidUserCollection]() .

<br>

## Architecture Diagram
<iframe frameborder="0" style="width:100%;height:489px;" src="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=userGraph.drawio#R7VpZc%2BI4EP41VO0%2BhMIXx2OATJKqyVZms3M9pWRb2FqM5ZHlQPLrt2VLPkWABCq1u%2BSUunW0Wp%2B%2Blhv3rNlqc81QEt5RH0c9c%2BBveta8Z5ojYwR%2FheC5ENi2WQgCRvxCZFSCB%2FKCpXAgpRnxcdpoyCmNOEmaQo%2FGMfZ4Q4YYo%2BtmswWNmrMmKMAdwYOHoq70O%2FF5WEjHzqCS32AShGpmYyA1K6QaS0EaIp%2BuayLrqmfNGKW8KK02MxwJ3ym%2FFP0%2BbdGWhjEc8306rAc3xh3y%2FkqtbHz9ebS8%2F2G4F3KUJxRlcsFfU8xmDCOO%2FZ45jGDoqcugFIhSKVGCqyeY%2FQbFfoSZUoIJbtUhXzp%2FVv5kNIt9LEwagHodEo4fEuQJ7RoABLKQryKoGWXv%2BhKVvZhxvKmJ5JKvMV1hzp6hidKOpfsl%2FiwFrHW1m4aShbWdHEoZkgAKyqErH0NBuvkAl086Ls%2BdCKJplnb8VfMGzXhEYjwrkS48uCBRNKMRZXlzy3fw2LdBnnJGl7imGZuuNRyCJmDIJzDhnDAYhtAY9DFlwhmylwK6KSQhSoQpq00gznc%2FxnxN2TLtu2BsNZiaKKYx3jFHghkBT2LR3EXe0oUu95VsqmSSC0yxyiZqjgGLYRMWky4qbEeDCutUqDDsDiw6WFB7sYjw5lJwG%2FgCx74szr0IpSnxmkeo6TkvY0955dXThf0GJ3adWPOSzklKxnCEOHlqMqnOc3KGe0rycyD3aGg096jcJDVESjPmYdmrznw7BjJGrYE4YgHmnYHAsei51iwRDdLOVpeOefvuq81u7H7BpguaLyVVkXH4KxMRY2pURUW2b6BuPWdv6wutCnOOQe5iJHnGx10iWyzw0PN0ROaPJu7gWDRgtpAx7vLAWINw%2B1Q0YFs7gVC6W22%2FUFwU%2BLiEBpNkU2xZCx0eXa3AU31vb4Q8ZO7fItIcFSOKxOhicQ%2BXJxnNxOYeAJjRKWKC06YJcz8wOCcDgy4mHMwK9zTlZ1Y4BAhW685oDj6aFZyTsUIGMeNMCduQUO78K5QwOhElXH%2F%2FwpbOI%2F8aPBqPF99Si5HbC9094f99SzQtRx%2FCD70lmpbdhwekxsPi4L0Xxb2nUs%2BbB1inkFfhqbDjrTfTq%2FXMQ9MQGzz5Mxivf%2F36wv%2FQJAgOZR7D3EI931BEfHFn3YN3gOkj%2BST5CvXsJJol5l4oUS43CRTOFH7Al7Pi14GmMyHpm45GqJONukKj2wz%2BGboZ2kKdbNQVGt1moqasbgp1spHTtbjd29D0Nlq94WdbdoJWqQEI0vD9SWCvkzYAnT0fgXJH7qB1HYAvezrRXQcW%2BRdofJSGJbEJ4iceij4jF0dwLyJyeJdyTle1BpcRCYSCUxFwkKx5YFWeotBHIMNUdYk4MSVKk8IdC7IRdnQSKmid2n2GC5a69YQ9U6gWpWYrn3qZuML77uOa8PBxReOAQgVu9glQqEsiwp8bbG4UExZ5R2FOINi%2FV6WOlKko47Q8MZ34qOH%2FV0Jmk49tzSPVUBMOjpFv0zPYCSnsjsQ1Sjrz15m%2Fzvz1L%2Bcv22zxl%2FPR%2FLU7N%2Fh2%2FsLwLIDCM4GdCexMYP8RAmt%2F2mF9%2BAVsvDtpcViCor7nQos3hP8QOjgnRe2n7CfK843slleeVSWGtdU6ierPuq7qltca%2FWqfV9ZSTa2MiDZrUsCstz3Xp15yyDMNux7MuyB4bzZl0gSP3UbFvtkUa9dAW1IpR8tbdD9mV0EqTVCsjZrik%2BcgR9qFVzCZCJ4scH%2BDpxjBvObAtCey4Ax%2B14bU2xhIDQjrBaditT2RMWxH1zzzAZoi%2BaFpMJdEU4urhdVb4qpAXs6pBXeRF%2BSWBFg7RR0ebdPtivi%2B6LgvgzXiuYbO2ge1Hj58vEBZVC1HvsEjLe%2BV783sIMNXKOcdp2ML4UG1emGngGr11pN19Q8%3D"></iframe>