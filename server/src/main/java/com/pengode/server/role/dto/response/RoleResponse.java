package com.pengode.server.role.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RoleResponse {
    private Long id;
    private String name;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
}
