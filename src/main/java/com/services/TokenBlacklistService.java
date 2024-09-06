package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;

public class TokenBlacklistService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String BLACKLIST_KEY = "token:blacklist:";

    public void blacklistToken(String token) {
        redisTemplate.opsForSet().add(BLACKLIST_KEY, token);
    }

    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.opsForSet().isMember(BLACKLIST_KEY, token);
    }
}
