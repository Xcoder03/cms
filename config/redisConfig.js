import redis from 'redis'
// redisConfig.js


const redisClient = redis.createClient({
  host: 'localhost', // Redis server host
  port: 6379,        // Redis server port
  // Add other configuration options as needed
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

export default redisClient;
