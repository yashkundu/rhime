# Recommendation Service

The main function of the Recommendation service is to to perform the initialFetch job which is scheduled by the [SpotifyService]() and to perform timely update users music data and friends recommendation.

<br>

## Database (spotify)

> Although noSQL database is used but a proper Schema is maintained.<br>
> 


### TokenCollection <br>
Same as in [SpotifyService]().

<br>

### ItemCollection <br>
Same as in [SpotifyService]().

<br>

### RecommendCollection
Same as in [SpotifyService]().
<br>


## JobProcessors
> Fetches the scheduled jobs from Redis and process them.

### InitialFetch Processor
Fetches the initial music data of the user using spotify web API, and processes it and uses [Weighted Jaccard Index](https://en.wikipedia.org/wiki/Jaccard_index) to calculate the similarities between users and calculate recommendations.\
It also schedules a **scheduledFetch** job which is scheduled once every week.

<br>

### ScheduledFetch Processor
It runs once every week and update the user data from spotify and updates their recommendation.


## Architecture Diagram
![recommendation](https://user-images.githubusercontent.com/58662119/206116622-bd576c7b-c8d5-4889-9a9f-849ecbefe128.png)