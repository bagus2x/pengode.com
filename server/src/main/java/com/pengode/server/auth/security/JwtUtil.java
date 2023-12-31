package com.pengode.server.auth.security;

import com.pengode.server.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@Component
@AllArgsConstructor
@Slf4j
public class JwtUtil {
    private final JwtProperties jwtProperties;

    public String generateAccessToken(Authentication authentication) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        int expirationInMinutes = jwtProperties.getAccessToken().getExpirationInMinutes();

        return generateAccessToken(
            authUser.getUser().getId(),
            authUser.getUsername(),
            LocalDateTime.now(),
            LocalDateTime.now().plusMinutes(expirationInMinutes)
        );
    }

    public String generateAccessToken(User user) {
        int expirationInMinutes = jwtProperties.getAccessToken().getExpirationInMinutes();

        return generateAccessToken(
            user.getId(),
            user.getUsername(),
            LocalDateTime.now(),
            LocalDateTime.now().plusMinutes(expirationInMinutes)
        );
    }

    public String generateRefreshToken(Authentication authentication) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        int expirationInMinutes = jwtProperties.getRefreshToken().getExpirationInMinutes();

        return generateRefreshToken(
            authUser.getUser().getId(),
            authUser.getUsername(),
            LocalDateTime.now(),
            LocalDateTime.now().plusMinutes(expirationInMinutes)
        );
    }

    public String generateRefreshToken(User user) {
        int expirationInMinutes = jwtProperties.getRefreshToken().getExpirationInMinutes();

        return generateAccessToken(
            user.getId(),
            user.getUsername(),
            LocalDateTime.now(),
            LocalDateTime.now().plusMinutes(expirationInMinutes)
        );
    }

    public String generateAccessToken(Long userId, String username, LocalDateTime issuedAt, LocalDateTime expirationAt) {
        return generateToken(accessTokenKey(), userId, username, issuedAt, expirationAt);
    }

    public String generateRefreshToken(Long userId, String username, LocalDateTime issuedAt, LocalDateTime expirationAt) {
        return generateToken(refreshTokenKey(), userId, username, issuedAt, expirationAt);
    }

    public String generateToken(Key key, Long userId, String username, LocalDateTime issuedAt, LocalDateTime expirationAt) {
        return Jwts.builder()
            .setClaims(Map.of("userId", userId))
            .setSubject(username)
            .setIssuedAt(Date.from(issuedAt.atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(Date.from(expirationAt.atZone(ZoneId.systemDefault()).toInstant()))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    private Key accessTokenKey() {
        String secret = jwtProperties.getAccessToken().getSecret();

        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    private Key refreshTokenKey() {
        String secret = jwtProperties.getAccessToken().getSecret();

        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(accessTokenKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(accessTokenKey()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
