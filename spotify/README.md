# Spotify Service

The main function of the Spotify service is to authorize user's spotify account, provide top artists, tracks and genres of a particular user and provide friends recommendation for the user.

<br>

## Database (spotify)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 


### TokenCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | userId of a user (**Primary Key**) |
| `access_token`      | `ObjectId` | spotify access_token |
| `refresh_token`      | `ObjectId` | spotify refresh_token |
| `expiration`      | `Date` | time at which access_token will expire |
<br>

### ItemCollection <br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `{userId: ObjectId, itemId: string}` | itemId is the id of an item (track, artist or genre) (**Primary Key**) |
| `itemName`      | `string` | name of the item (track, artist or genre) |
| `wt`      | `Int32` | Weightage of the item in caclculating user recommends  |
| `itemType`      | `string` | 0 - track, 1 - artist, 2 - genre |

<br>

### RecommendCollection

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `{userId1: ObjectId, userId2: ObjectId}` | userId2 user appears in the friends recommendation of userId2 user(**Primary Key**) |
| `isValid`      | `boolean` | is the recommendation valid or not |
| `similarity`      | `Double` | Similarity score between the users (0-1) |
<br>

## API Reference

This routes directs to the spotify authorization page.

```code
  GET /api/spotify/authorize
```
\
Spotify redirects to this URL route after successfull authorization.

```code
  GET /api/spotify/callback
```
\
Returns the accessToken which is used internally by the client.

```code
  GET /api/spotify/getToken
```
\
Gets the top artists for the user with id userId

```code
  GET /api/spotify/getTopArtists/:userId
```

\
Gets the top traks for the user with id userId

```code
  GET /api/spotify/getTopTracks/:userId
```

\
Gets the top items (artists, tracks and genres) for the user with id userId

```code
  GET /api/spotify/getTopItems/:userId
```

\
Gets the friends recommendation for the current user

```code
  GET /api/spotify/getUserRecommends
```

\
Removes the alreaded viewed friend recommendation from recommendations list

```code
  GET /api/spotify/discardRecommend/:userId
```
<br>

## Events

### UserAuthorizedEvent


It is published whenever a user authorize their spotify to connect with the application .
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `userId`      | `string` | userId of the authorized user |


## Architecture Diagram
![spotify](https://user-images.githubusercontent.com/58662119/206095489-400a740e-4fbf-4d4f-b6c7-c884e439cfef.png)