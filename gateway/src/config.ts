
const service = {
    auth: "auth",
    feed: "feed",
    notification: "notification",
    post: "post",
    comment: "comment",
    recommendation: "recommendation",
    spotify: "spotify",
    user: "user",
    userGraph: "user-graph",
    like: "like",
    likeCount: "like-count",
    client: "client",
}

interface ServiceRecord {
    serviceName: string;
    endpoint: string;
    authentication: boolean;
    authorization?: boolean;
    changeOrigin: boolean;
}

const PROXY_ROUTES: ServiceRecord[] = [
    {
        serviceName: service.auth,
        endpoint: '/api/auth',
        authentication: false,
        changeOrigin: true
    },
    {
        serviceName: service.feed,
        endpoint: '/api/feed',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.notification,
        endpoint: '/api/notification',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.post,
        endpoint: '/api/post',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.comment,
        endpoint: '/api/comment',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.recommendation,
        endpoint: '/api/recommendation',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.spotify,
        endpoint: '/api/spotify',
        authentication: true,
        changeOrigin: false
    },
    {
        serviceName: service.userGraph,
        endpoint: '/api/userGraph',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.user,
        endpoint: '/api/user',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.likeCount,
        endpoint: '/api/likeCount',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.like,
        endpoint: '/api/like',
        authentication: true,
        authorization: true,
        changeOrigin: true
    },
    {
        serviceName: service.client,
        endpoint: '/',
        authentication: false,
        authorization: false,
        changeOrigin: true
    }
]





// const PROXY_ROUTES = [
    // {
    //     url: '/auth',
    //     auth: true,
    //     rateLimit: {
    //         windowMs: 1000 * 60 * 15,
    //         max: 5,
    //         standardHeaders: true,
    //         legacyHeaders: false
    //     },
    //     proxy: {
    //         target: 'https://www.google.com/',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/auth': '',
    //         }
    //     }
    // },
    // {
    //     url: '/notAuth',
    //     auth: false,
    //     rateLimit: {
    //         windowMs: 1000 * 60 * 15,
    //         max: 5,
    //         standardHeaders: true,
    //         legacyHeaders: false
    //     },
    //     proxy: {
    //         target: 'https://www.google.com/',
    //         changeOrigin: true,
    //         pathRewrite: {
    //             '^/notAuth': '',
    //         }
    //     }
    // }
// ]

export {PROXY_ROUTES}