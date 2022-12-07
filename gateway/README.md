# Gateway Service

This acts as an [API Gateway](https://www.ibm.com/cloud/blog/api-gateway) for our microservices.\
The two main function of this is : 
- It authenticates all the incoming requests in which authentication is required as mentioned in [config.ts](/gateway/src/config.ts) file.
- It proxies all the requests to their respective microservices according to the endpoints provided in [config.ts](/gateway/src/config.ts) file.

<br>

## Service Discovery

One big question is how will our gateway get the ip address of our microservices which will be required to proxy the incoming requests.\
\
One option is hard coding the ip addresses of the services. There is a big downside because the service may be restarted and their ip can change so it won't be communicated to the gateway.\
So, I wrote a simple service discovery/registry using etcd [Service Discovery](https://github.com/yashkundu/discovery-rhime).\
This works for development.
\
\
Docker provide Service discovery out of the box using Docker networks and Kuberntes also provides automatic dns using Kubernetes services so we can use that in production.

<br>

## Architecture Diagram
![gateway](https://user-images.githubusercontent.com/58662119/206135138-28710d82-0e3d-4dac-8104-b8ae5a363930.png)