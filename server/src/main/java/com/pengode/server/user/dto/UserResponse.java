package com.pengode.server.user.dto;

import com.pengode.server.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserResponse {
    private Long id;
    private ProfileResponse profile;
    private String email;
    private String username;
    private List<String> authorities;
    private LocalDateTime createdAt;

    public static UserResponse build(User user) {
        ProfileResponse profileResponse = ProfileResponse.builder()
            .name(user.getProfile().getName())
            .photo(user.getProfile().getPhoto())
            .build();

        ArrayList<String> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add("ROLE_" + role.getName());

            role.getPrivileges().forEach(privilege -> authorities.add(privilege.getName()));
        });

        return UserResponse.builder()
            .id(user.getId())
            .profile(profileResponse)
            .email(user.getEmail())
            .username(user.getEmail())
            .authorities(authorities)
            .createdAt(user.getCreatedAt())
            .build();
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class ProfileResponse {
        private String name;
        private String photo;
    }
}
