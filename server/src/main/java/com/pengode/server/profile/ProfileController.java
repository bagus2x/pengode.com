package com.pengode.server.profile;

import com.pengode.server.auth.security.AuthUser;
import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.profile.dto.response.ProfileResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/profiles")
    public PageResponse<ProfileResponse> getAll(PageRequest request) {
        return profileService.getAll(request);
    }

    @GetMapping("/profile")
    public Object getProfile(@AuthenticationPrincipal AuthUser authUser) {
        return ProfileResponse.build(authUser.getUser().getProfile());
    }

    @GetMapping("/profile/{profileId}")
    public ProfileResponse getById(@PathVariable Long profileId) {
        return profileService.getById(profileId);
    }
}
