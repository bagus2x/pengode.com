package com.pengode.server.articlestatus.dto.response;

import com.pengode.server.articlestatus.ArticleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ArticleStatusResponse {
    private Long id;
    private String name;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    public static ArticleStatusResponse build(ArticleStatus status) {
        return ArticleStatusResponse.builder()
            .id(status.getId())
            .name(status.getName().name())
            .updatedAt(status.getUpdatedAt())
            .createdAt(status.getCreatedAt())
            .build();
    }
}
