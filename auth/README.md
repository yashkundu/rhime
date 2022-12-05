# Auth Service

The main function of the Auth service is to provide functionalites of Sign Up, Sign In and Sign Out.

There are two ways of implementing authentication : 
- Stateful authentication using sessions.
- Stateless authentication using signed token.


Stateless Authentication is used to make it scalable.

[JWT (JSON Web Token)]() are sent as a cookie to the clients so that their further requests could be authorized.
<br>
<br>
## Database
---

> Although noSQL database is used but a proper Schema is maintained.<br>
> 
<br>

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
---
\
Registers a new user, and sends a [UserCreatedEvent]() .

```http
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
\
Gets the current user

```code
  POST /api/auth/currentUser
```
<br>

## Events
---
<br>

#### UserCreatedEvent
<br>

It is fired whenever a new user signs up .
| Attribute        | Type        | Description |   
| ------------- |:-------------: | ----------  |
| userId      | string | _id of [UserCollection]() |
| email      | string | email id of user |
| userName      | string      |  unique userName of user |