# LikeBatchUpdater Service

The main function of the LikeBatchUpdater service is to consume [LikeToggledEvent](../like/README.md#liketoggledevent) and update [RTLikeCountCollection](#rtlikecountcolletion-) in batches.

<br>

## Database (like)

> Although noSQL database is used but a proper Schema is maintained.<br>


<br>


### RTLikeCountColletion <br>
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | id of an item (a post or comment) (**Primary Key**) |
| `count`      | `Int32` | no. of likes on the item (a post or comment) |

<br>

### DailyLikeCountCollection <br>
| Attribute        | Type        | Description |   
| :------------- |:------------- | :----------  |
| `_id`      | `ObjectId` | id of an item (a post or comment) (**Primary Key**) |
| `count`      | `Int32` | no. of likes on the item (a post or comment) |

<br>

## EventHandlers
> Handlers consumes events from NATS stream and processes them.
### [LikeToggled EventHandler](/like-batch-updater/src/handlers/likeToggledHandler.ts)
It captures the [LikeToggledEvent](../like/README.md#liketoggledevent) and processes it and updates the[RTLikeCountCollection](#rtlikecountcolletion) in batches (update per 5min.) to update the likeCount of items.

<br>


## Architecture

### [RTLikeCountCollection](#rtlikecountcolletion) does not store accurate likeCount
Since NATS does not guarantee exactly once messaging, so some events may be consumed more than once, so RTLikeCount won't always have a precise like count.

### [DailyLikeCountCollection](#dailylikecountcollection) to store accurate likeCount
A daily cron job will update the [DailyLikeCountCollection](#dailylikecountcollection) from [ItemLikeCollection](../like/README.md#itemlikecollection) and clear the user's RTLikeCount in a single transaction.\
Then the total likes on an item can be more accurately calculated by summing the values of RTLikeCount and DailyLikeCount.






<br>

## Architecture Diagram
![likeBatchUpdater](https://user-images.githubusercontent.com/58662119/206021166-e7bf81e6-fb0a-4817-aa83-492895c5357a.png)