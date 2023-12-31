package com.pengode.server.common.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@With
public class ErrorResponse {
    private Set<String> messages;
    private Integer code;
    private LocalDateTime time;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String trace;
}
