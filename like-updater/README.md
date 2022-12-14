# LikeUpdater Service

The main function of the LikeUpdater service is to consume [LikeToggledEvent](../like/README.md#liketoggledevent) and update [ItemLikeCollection](../like/README.md#itemlikecollection).

<br>

## Database (like)

> Although noSQL database is used but a proper Schema is maintained.<br>


<br>

### [ValidItemCollectionn](../like/README.md#validitemcollection) <br>
Shares this collection with [LikeService](../like). Although it violates the microservices design pattern, but it works because one service can only read and the other can only write.


### [ItemLikeCollection](../like/README.md#itemlikecollection) <br>
Shares this collection with [LikeService](../like). Although it violates the microservices design pattern, but it works because one service can only read and the other can only write.

<br>

## EventHandlers
> Handlers consumes events from NATS stream and processes them.
### [LikeToggled EventHandler](/like-updater/src/handlers/likeToggledHandler.ts)
It captures the [LikeToggledEvent](../like/README.md#liketoggledevent) and processes it and updates the[ItemLikeCollection](../like/README.md#itemlikecollection) to persistently store the likes.

<br>


## Architecture

### Handling event exactly once
Most of the persisten message buses or brokers only provide atleast once guarantee, it means there is a possibility that the consumer can consume the same message more than once. NATS Jetstream also provides atleast once guarantee.
It's better to have idempotent events (i.e can be consumed more than once without any violations).\
But [LikeToggledEvent](../like/README.md#liketoggledevent) is not idempotent. So
we can use an inmemory store to store the guid of [LikeToggledEvent](../like/README.md#liketoggledevent) for 5 minutes so that it is not handled the second time.

### Using pull consumer instead of push
Since like flows at such a high volume and frequency, push consumers won't keep up with the pace and the events won't be acknowledged in time, and will be retried again and again and it will cause a complete failure.\
On the other hand pull consumers can consumer events on their own pace, so push consumers are used.

<br>

## Architecture Diagram
![likeUpdater](https://user-images.githubusercontent.com/58662119/206028821-7068e839-aebc-46df-a837-c2682f50a638.png)