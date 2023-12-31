package com.pengode.server.auth.dto.response;

import com.pengode.server.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;

    public static AuthResponse build(String accessToken, String refreshToken, User user) {
        UserResponse userResponse = UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .name(user.getProfile().getName())
            .photo(user.getProfile().getPhoto())
            .build();

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .user(userResponse)
            .build();
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class UserResponse {
        private Long id;
        private String email;
        private String username;
        private String name;
        private String photo;
    }
}
