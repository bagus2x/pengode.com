package com.pengode.server.profile.dto.response;

import com.pengode.server.profile.Profile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ProfileResponse {
    private Long id;
    private UserResponse user;
    private String name;
    private String photo;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    public static ProfileResponse build(Profile profile) {
        UserResponse userResponse = UserResponse.builder()
            .email(profile.getUser().getEmail())
            .username(profile.getUser().getUsername())
            .build();

        return ProfileResponse.builder()
            .id(profile.getId())
            .user(userResponse)
            .name(profile.getName())
            .photo(profile.getPhoto())
            .createdAt(profile.getCreatedAt())
            .updatedAt(profile.getUpdatedAt())
            .build();
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class UserResponse {
        private String email;
        private String username;
    }
}
