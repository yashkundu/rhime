
// for a particular user only likes or dislikes in last LIKES_TIME_LIMIT ms will
// be stored in redis because it can take some time to persist likes.
export const LIKES_TIME_LIMIT=1000*60*5        // 5min