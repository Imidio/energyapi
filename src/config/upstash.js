import { Redis } from '@upstash/redis'
import { Ratelimit } from "@upstash/ratelimit";

import "dotenv/config";

const ratelimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100,"60 s"),
});

export default ratelimiter;
// url: 'https://nice-gazelle-23775.upstash.io',
//token: 'AVzfAAIjcDE5MzU5OTdkMTBkMWQ0ZGQzYjBiYzQwODgyZGZmODBmMHAxMA',

//await redis.set("foo", "bar");
//await redis.get("foo");