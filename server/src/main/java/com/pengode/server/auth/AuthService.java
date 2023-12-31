package com.pengode.server.auth;

import com.pengode.server.auth.dto.request.SignInRequest;
import com.pengode.server.auth.dto.request.SignUpRequest;
import com.pengode.server.auth.dto.request.SocialRequest;
import com.pengode.server.auth.dto.response.AuthResponse;
import com.pengode.server.auth.security.AuthUser;
import com.pengode.server.auth.security.JwtUtil;
import com.pengode.server.profile.Profile;
import com.pengode.server.role.Role;
import com.pengode.server.role.RoleRepository;
import com.pengode.server.user.User;
import com.pengode.server.user.UserRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final Validator validator;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RestClient restClient;

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        Set<ConstraintViolation<SignUpRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Username has been taken");
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email has been taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.isEnabled(false);

        Profile profile = new Profile();
        profile.setName(request.getName());
        profile.setUser(user);
        user.setProfile(profile);

        Role role = roleRepository.findByName("USER")
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role is not found"));
        user.setRoles(Collections.singletonList(role));

        return saveAndGenerateToken(user);
    }

    @Transactional
    public AuthResponse github(SocialRequest request) {
        Set<ConstraintViolation<SocialRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Map<?, ?> githubProfile = restClient
            .get()
            .uri("https://api.github.com/user")
            .header("Authorization", "token " + request.getToken())
            .retrieve()
            .body(Map.class);

        if (githubProfile == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot use github. Try again later");
        }

        String email = (String) githubProfile.get("email");
        String username = (String) githubProfile.get("login");
        String name = (String) githubProfile.get("name");
        String photo = (String) githubProfile.get("avatar_url");

        if (email == null) {
            Map<?, ?>[] githubEmails = restClient
                .get()
                .uri("https://api.github.com/user/emails")
                .header("Authorization", "token " + request.getToken())
                .retrieve()
                .body(Map[].class);

            if (githubEmails == null || githubEmails.length == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot use github. Try again later");
            }

            for (Map<?, ?> githubEmail : githubEmails) {
                if ((Boolean) githubEmail.get("primary") && (Boolean) githubEmail.get("verified")) {
                    email = (String) githubEmail.get("email");
                }
            }
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return signIn(email);
        }

        return saveAndGenerateToken(email, username, name, photo);
    }

    @Transactional
    public AuthResponse google(SocialRequest request) {
        Set<ConstraintViolation<SocialRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Map<?, ?> googleProfile = restClient
            .get()
            .uri("https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getToken())
            .retrieve()
            .body(Map.class);

        if (googleProfile == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot use google. Try again later");
        }

        String email = (String) googleProfile.get("email");
        String username = email.split("@")[0];
        String name = (String) googleProfile.get("name");
        String photo = (String) googleProfile.get("picture");

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return signIn(email);
        }

        return saveAndGenerateToken(email, username, name, photo);
    }

    private AuthResponse saveAndGenerateToken(String email, String username, String name, String photo) {
        User user = userRepository.findByUsernameOrEmail(username, email).orElse(null);
        if (user != null) {
            username = (username + System.currentTimeMillis()).substring(0, 10);
        }

        user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.isEnabled(true);

        Profile profile = new Profile();
        profile.setName(name);
        profile.setPhoto(photo);
        profile.setUser(user);
        user.setProfile(profile);

        return saveAndGenerateToken(user);
    }

    private AuthResponse saveAndGenerateToken(User user) {
        user = userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.build(accessToken, refreshToken, user);
    }

    private AuthResponse signIn(String email) {
        User user = userRepository.findByUsernameOrEmail(email, email).orElseThrow();

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return AuthResponse.build(accessToken, refreshToken, user);
    }

    public AuthResponse signIn(SignInRequest request) {
        Set<ConstraintViolation<SignInRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        AuthUser authUser = (AuthUser) authenticationManager.authenticate(authentication).getPrincipal();

        String accessToken = jwtUtil.generateAccessToken(authUser.getUser());
        String refreshToken = jwtUtil.generateRefreshToken(authUser.getUser());

        return AuthResponse.build(accessToken, refreshToken, authUser.getUser());
    }
}
