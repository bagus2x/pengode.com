package com.pengode.server.role;

import com.pengode.server.role.dto.request.CreateRoleRequest;
import com.pengode.server.role.dto.response.RoleResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@AllArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final Validator validator;

    @Transactional
    public RoleResponse create(CreateRoleRequest request) {
        Set<ConstraintViolation<CreateRoleRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Role role = new Role();
        role.setName(request.getName());

        role = roleRepository.save(role);

        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setName(role.getName());
        response.setUpdatedAt(role.getUpdatedAt());
        response.setCreatedAt(role.getCreatedAt());

        return response;
    }
}
