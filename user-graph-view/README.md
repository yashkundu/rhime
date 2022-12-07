
# UserGraphView Service

The main function of the UserGraphView service is to provide remote procedures to get the followers or followees of a user. This can only be accessed by other services of the application.

<br>

## Database (userGraph)

### [MinionCollection]()
Shares with [UserGraphService]()

### [MessiahCollection]()
Shares with [UserGraphService]()

<br>

## Remote Procedure Calls

### getMinions

Streams the followers of a user

```code
  rpc getMinions(SingleUser) returns (stream Minions) {}
```


### getMessiahs

Streams the followees of a user

```code
  rpc getMessiahs(SingleUser) returns (stream Messiahs) {}
```

<br>

## Architecture

### [gRPC] over REST API
Since, this service only communicates with other services, and not external clients so gRPC will be fine because it is much lightweight than REST.

## Architecture Diagram
![userGraphView](https://user-images.githubusercontent.com/58662119/206082371-29eef34f-99e5-4058-a89f-5a20cbcee3a3.png)