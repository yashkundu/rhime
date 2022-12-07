# User Service

The main function of the Comment service is to create and fetch comments of a post and the count of comments.

<br>

## Database (user)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 

#### UserProfileCollection <br>
<br>

| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | userId of user (**Primary Key**) |
| `userName`      | `string` | userName of the user |
| `email`      | `string` | email of the user  |
| `firstName`      | `string` | first name of the user |
| `lastName`      | `string` | last name of the user |
| `bio`      | `string` | bio of the user |
| `gender`      | `string` | gender of the user |
| `profileImage`      | `string` | url of profile image of the user |
<br>

## API Reference

Gets the profile info of a user with id userId

```code
  GET /api/user/:userId/profile
```
Gets the name and username of a user

```code
  GET /api/user/:userId/profile/forPost
```

Upload a new profile image

```code
  PUT /api/user/:userId/profile/image
```

Delete the previous profile image

```code
  DELETE /api/user/:userId/profile/image
```

<br>



## Handlers
> Handlers consumes events from NATS stream and processes them.
### [UserCreated Handler](/user/src/handlers/userCreatedHandler.ts)
It consumes the [UserCreatedEvent](../auth/README.md#usercreatedevent) and processes it to create a document related to that user in [UserProfileCollection](#userprofilecollection-) .

<br>

## Architecture Diagram
![user](https://user-images.githubusercontent.com/58662119/206245890-460d213e-616a-4c7a-bbb7-eef831114275.png)