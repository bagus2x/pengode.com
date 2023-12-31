package com.pengode.server.auth;

import com.pengode.server.auth.dto.request.SignInRequest;
import com.pengode.server.auth.dto.request.SignUpRequest;
import com.pengode.server.auth.dto.request.SocialRequest;
import com.pengode.server.auth.dto.response.AuthResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/sign-up")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signUp(@RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("/sign-in")
    public AuthResponse signIn(@RequestBody SignInRequest request) {
        return authService.signIn(request);
    }

    @PostMapping("/github")
    public AuthResponse github(@RequestBody SocialRequest request) {
        return authService.github(request);
    }

    @PostMapping("/google")
    public AuthResponse google(@RequestBody SocialRequest request) {
        return authService.google(request);
    }
}
