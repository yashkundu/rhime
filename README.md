# 🎸 Rhime

Rhime is a social media application to recommend music to friends with similar taste.

[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](/LICENSE.md)

## More Info 
- [Usage](/docs/Usage.md)
- [Screenshots](/docs/Screenshots.md)


## Built With

\
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

<img src="https://user-images.githubusercontent.com/58662119/205492707-bf15a9b2-fe6f-42c1-a405-2e590fc69a0b.png" alt="drawing" width="110"/>

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

![Kubernetes](https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white)

<img src="https://user-images.githubusercontent.com/95200/143832033-32e868df-f3b0-4251-97fb-c64809a43d36.png" alt="drawing" width="90"/>

\
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)

![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</br>

## Running Locally

### Using [Docker](https://www.docker.com/)

Docker and docker-compose should be installed in the system.

Make these three files in the rhime root directory of the project.

authSecrets.env
```code
    ACCESS_TOKEN_SECRET=<your_secret>
    SIGNED_COOKIE_SECRET=<your_secret>
```

awsSecrets.env
```code
    AWS_ACCESS_KEY_ID=<your_keyId>
    AWS_SECRET_ACCESS_KEY=<your_access_key>
```

spotifySecrets.env
```code
    SPOTIFY_CLIENT_KEY=<your_key>
    SPOTIFY_CLIENT_SECRET=<your_secret>
```
After that run : 
```code
    docker compose up
```

<br>

### Using [Kubernetes](https://kubernetes.io/)

Kubernetes should be installed on the system.

Create Kubernetes secret of the three files mentioned in the [Using docker](#using-docker) section.

Go to [/infra/k8s](/infra/k8s) directory and build all the configuration yaml files using :
```code
    kubectl build 
```
Or
```code
    kubectl apply
```
But it will be very complicated, So if you want to run a K8 cluster use next method.
<br>

### Running Kubernetes cluster using [Helm](https://helm.sh/) charts

Create Kubernetes secret of the three files mentioned in the [Using docker](#using-docker) section.

Helm is a Kubernetes package manager which makes it very simple to run kubernetes applications.

[rhimeChart](/rhimeChart) is a Helm chart which can be easily installed to the local Kubernetes cluster.

Just run :
```code
    helm install myChart rhimeChart
```

<br>

## Basic Architecture
\
It follows [event-driven](https://en.wikipedia.org/wiki/Event-driven_architecture) architecture by utilizing asynchronous events to communicate between components.\
\
The application is made up of multiple decoupled [microservices](https://microservices.io/) which have specific responsibilities and are independent of each other.\
\
These services communicate with each other using asynchronous events (or messages) using [NATS](https://nats.io/) as an event bus (or message streaming, similar to [message brokers](https://en.wikipedia.org/wiki/Message_broker)). NATS was used because it provides lightweight persistent message streaming using [JetStream](https://docs.nats.io/nats-concepts/jetstream).\
\
[MongoDB](https://www.mongodb.com/home) is used as the primary database for the services. Each service has their own database and services cannot interact with other service's database according to the architectural design patterns of microservices.\
\
[Redis](https://redis.io/) is used in multiple services as a cache to store timeline posts, as a data store for task queue, etc.\
\
[BullMQ](https://docs.bullmq.io/) is used as [job queue](https://en.wikipedia.org/wiki/Job_queue) to schedule tasks that fetch user data and improve recommendations at regular bases.\
\
A [Cron Job](https://en.wikipedia.org/wiki/Cron) is also used in a service to periodically update a database.


## Microservices overview
Visit any service to know about the detailed architectural design of that service.
- [Auth Service](/auth) : *This service handles the authentication for the application by issuing JWT(JSON Web Tokens) and handlers the basic SigIn, SignUp, SignOut functionalities.*
- [User Service](/user) : *This service handles information about the user's profile like getting or updating profile info, updating profile image.*
- [Post Service](/post) : *This service handles creation and fetching of posts.*
- [Comment Service](/comment) : *This service handles creation and fetching of comments on user posts.*
- [Like Service](/like) : *This service handles the likes and dislikes on posts and comments. This functionality is implemented as a combination of below mentioned services:*
    - [Like Service](/like) : *This service is responsibe for toggling likes and checking if a user has liked a particular item or not.*
    - [Like Updater Service](/like-updater) : *This service is responsible for asynchronously updating the persistent database which stores likes. This is done asynchronously to make the liking scalable for higher no. of users.*
    - [Like Batch Updater Service](/like-batch-updater) : *This service is responsible for updating the like count on items (posts and comments) in batches, which is much more efficient than updating count in stream.*
    - [Like Count Service](/like-count) : *This service is responsible for getting the like count on a particular post or comment.*
- [User Graph Service](/user-graph) : *This service is responsible for maintaining user-graph that is who follows who and provides functionalites like, following or unfollowing a user, getting the no. of followers(minions) of followees(messiahs), checking if a user is a follower or not, etc.*
- [User Graph View Service](/user-graph-view) : *This service is not used by external clients, but it used by other internal services to get user graph. It implements [rpc (remote procedure call)](https://en.wikipedia.org/wiki/Remote_procedure_call) api instead of REST(because it's logical for inter-service communication and faster than REST). [GRPC](https://grpc.io/) framework is used to implement RPC.*
- [Feed Service](/feed) : *This service is responsible for fetching the home timeline and profile timeline for users. It also fan outs the posts to user timeline and cache recent timeline posts, and do some other stuff.*
- [Spotify Service](/spotify) : *This service is responsible for connecting user's spotify account, getting user's top tracks, top items and top artists, and also fetches the recommended friends for a user and their similarity stats.*
- [Recommendation Service](/recommendation) : *When the user initially connects spotify account, this service is responsible for fetching initial music data and creating initial recommendations for user. This service also periodically fetches the user's data to update their music taste and updates their recommended friends.*
- [Gateway Service](/gateway) : *This is a reverse-proxy which acts as an api gateway and routes the traffic to their respective microservices. The gateway also does the authentication and discards unauthenticated requests and proxies the authenticated ones.*

<br>

## Architectures of the services
- [Auth Service](/auth/README.md#architecture-diagram)
- [User Service](/user/README.md#architecture-diagram) 
- [Post Service](/post/README.md#architecture-diagram) 
- [Comment Service](/comment/README.md#architecture-diagram) 
- [Like Service](/like/README.md#architecture-diagram) 
- [Like Updater Service](/like-updater/README.md#architecture-diagram) 
- [Like Batch Updater Service](/like-batch-updater/README.md#architecture-diagram) 
- [Like Count Service](/like-count/README.md#architecture-diagram) 
- [User Graph Service](/user-graph/README.md#architecture-diagram) 
- [User Graph View Service](/user-graph-view/README.md#architecture-diagram)
- [Feed Service](/feed/README.md#architecture-diagram) 
- [Spotify Service](/spotify/README.md#architecture-diagram) 
- [Recommendation Service](/recommendation/README.md#architecture-diagram) 
- [Gateway Service](/gateway/README.md#architecture-diagram) 

<br>

## Shared modules
- [Discovery module](https://github.com/yashkundu/discovery-rhime) : Implements a service registry (like a local dns system) in which services will register and service names are resolved to their ip. Etcd is used to implement service registry, which also tracks the health of the service and provide information to the gateway server. Docker and kubernetes implements automatic dns out of the box. 
- [Events module](https://github.com/yashkundu/events-rhime) : Implements the interface of events through which different microservices communicate with each other.
- [Common module](https://github.com/yashkundu/common-rhime) : Contains the common middleares and utilities for all services.

<br>

## [Client](/client)

Build  using NextJs, and utilizes both server-side and client-side rendering.