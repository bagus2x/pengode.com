package com.pengode.server.profile;

import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.profile.dto.response.ProfileResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    public PageResponse<ProfileResponse> getAll(PageRequest request) {
        Page<Profile> profiles = profileRepository.findAll(request.pageable());

        return PageResponse.create(profiles.map(ProfileResponse::build));
    }

    public ProfileResponse getById(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        return ProfileResponse.build(profile);
    }
}
