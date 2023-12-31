package com.pengode.server.auth.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtProperties {
    private AccessToken accessToken;
    private RefreshToken refreshToken;

    @Data
    public static class AccessToken {
        private int expirationInMinutes;
        private String secret;
    }

    @Data
    public static class RefreshToken {
        private int expirationInMinutes;
        private String secret;
    }
}
