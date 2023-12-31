package com.pengode.server.articlecategory.dto.response;

import com.pengode.server.articlecategory.ArticleCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ArticleCategoryResponse {
    private Long id;
    private String name;
    private String color;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    public static ArticleCategoryResponse build(ArticleCategory category) {
        return ArticleCategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .color(category.getColor())
            .updatedAt(category.getUpdatedAt())
            .createdAt(category.getCreatedAt())
            .build();
    }
}
