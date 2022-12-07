# Auth Service

The main function of the Auth service is to provide functionalites of Sign Up, Sign In and Sign Out.

There are two ways of implementing authentication : 
- Stateful authentication using sessions.
- Stateless authentication using signed token.


Stateless Authentication is used to make it scalable.

[JWT (JSON Web Token)](https://en.wikipedia.org/wiki/JSON_Web_Token) are sent as a cookie to the clients so that their further requests could be authorized.
<br>
<br>
## Database (authUser)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 


#### UserCollection <br>
<br>

| Attribute        | Type        | Description |   
| ------------- |:-------------: | ----------  |
| _id      | ObjectId | unique object id of a user (**Primary Key**) |
| email      | string | email id of user |
| userName      | string      |  unique userName of user |
| password | string     |   password of user |
|isAuth | boolean   | If spotify has been authorized or not  |
<br>

## API Reference

Registers a new user, and sends a [UserCreatedEvent](/auth#usercreatedevent) .

```code
  POST /api/auth/signup
```
\
Signs in a user, by sending a JWT as a cookie to the client.

```code
  POST /api/auth/signin
```
\
Logs out the user by removing the cookie.

```code
  POST /api/auth/signin
```
<br>

## Events


#### UserCreatedEvent


It is fired whenever a new user signs up .
| Attribute        | Type        | Description |   
| ------------- |:-------------: | ----------  |
| userId      | string | _id of [UserCollection]() |
| email      | string | email id of user |
| userName      | string      |  unique userName of user |
<br>

## Handlers
> Handlers consumes events from NATS stream and processes them.
### [UserAuthorized Handler](https://github.com/yashkundu/rhime/blob/master/auth/src/handlers/userAuthorizedHandler.ts)
It captures the [UserAuthorized Event]() and processes it and makes isAuth field of [User Collection]() true.

<br>

## Architecture Diagram
![auth](https://user-images.githubusercontent.com/58662119/206139474-a67dbfa8-8806-4e60-b0df-4fc401e7b1cc.png)