package com.pengode.server.user;

import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public PageResponse<UserResponse> getAll(PageRequest request) {
        Page<User> users = userRepository.findAll(request.pageable());

        return PageResponse.create(users.map((UserResponse::build)));
    }

    public UserResponse getById(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User is not found"));

        return UserResponse.build(user);
    }
}
