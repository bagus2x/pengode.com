package com.pengode.server.common.config;

import com.pengode.server.articlestatus.ArticleStatus;
import com.pengode.server.articlestatus.ArticleStatusRepository;
import com.pengode.server.profile.Profile;
import com.pengode.server.role.Role;
import com.pengode.server.role.RoleRepository;
import com.pengode.server.user.User;
import com.pengode.server.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Configuration
@AllArgsConstructor
@Slf4j
public class InitializerConfig implements CommandLineRunner {
    private final InitializerProperties initializerProperties;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ArticleStatusRepository articleStatusRepository;
    private final PasswordEncoder passwordEncoder;
    private final ArrayList<String> messages = new ArrayList<>();

    @Override
    @Transactional
    public void run(String... args) {
        initializeRoles();
        initializeAdmin();
        initializeArticleStatus();

        messages.forEach(log::info);
    }

    private void initializeRoles() {
        initializerProperties.getRoles().forEach((roleName) -> {
            if (!roleRepository.existsByNameIgnoreCase(roleName)) {
                Role role = new Role();
                role.setName(roleName);

                roleRepository.save(role);
                messages.add("Role " + roleName + " created");
            }
        });
    }

    private void initializeAdmin() {
        if (!userRepository.existsByRolesNameIn(Collections.singletonList("ADMIN"))) {
            initializerProperties.getAdmins().forEach((data) -> {
                String email = data.get("email");
                String username = data.get("username");
                String password = data.get("password");
                String name = data.get("name");

                User user = new User();
                user.setEmail(email);
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(password));
                user.isEnabled(true);

                Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
                Role userRole = roleRepository.findByName("USER").orElseThrow();
                user.setRoles(List.of(adminRole, userRole));

                Profile profile = new Profile();
                profile.setName(name);
                profile.setUser(user);
                user.setProfile(profile);

                userRepository.save(user);

                messages.add("Admin " + username + " created");
            });
        }
    }

    private void initializeArticleStatus() {
        for (ArticleStatus.Name articleName : ArticleStatus.Name.values()) {
            if (!articleStatusRepository.existsByName(articleName)) {
                ArticleStatus status = new ArticleStatus();
                status.setName(articleName);

                articleStatusRepository.save(status);
                messages.add("Article status " + articleName + " created");
            }
        }
    }
}
