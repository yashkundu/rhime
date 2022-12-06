# LikeCount Service

The main function of the LikeCount service is fetch the number of likes on an item.

<br>

## Database (like)

> Although noSQL database is used but a proper Schema is maintained.

### [RTLikeCountCollection]() <br>
Shares this collection with [LikeBatchUpdaterService](). Although it violates the microservices design pattern, but it works because one service can only read and the other can only write.


### [DailyLikeCountCollection]() <br>
Shares this collection with [LikeBatchUpdaterService](). Although it violates the microservices design pattern, but it works because one service can only read and the other can only write.


<br>

## API Reference

Fetches the number of like on an item (a post or comment) with id itemId (postId or commentId).

```code
  GET /api/likeCount/:itemId
```


## Architecture

### Calculating likeCount
The total likes on an item are  calculated by summing the values of RTLikeCount and DailyLikeCount.

<br>

## Architecture Diagram
![likeCount](https://user-images.githubusercontent.com/58662119/206028353-a01d4e00-e257-4f46-a04c-a1ad2c462d69.png)