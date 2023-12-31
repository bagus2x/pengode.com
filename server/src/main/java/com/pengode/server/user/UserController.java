package com.pengode.server.user;

import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.user.dto.UserResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/users")
    public PageResponse<UserResponse> getAll(PageRequest request) {
        return userService.getAll(request);
    }

    @GetMapping("/user/{userId}")
    public UserResponse getById(@PathVariable Long userId) {
        return userService.getById(userId);
    }
}
