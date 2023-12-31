package com.pengode.server.article.dto.response;

import com.pengode.server.article.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ArticleResponse {
    private Long id;
    private ProfileResponse author;
    private String title;
    private String thumbnail;
    private String body;
    private String summary;
    private StatusResponse status;
    private List<CategoryResponse> categories;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ArticleResponse create(Article article) {
        return ArticleResponse.builder()
            .id(article.getId())
            .author(new ProfileResponse(
                article.getAuthor().getId(),
                article.getAuthor().getName(),
                article.getAuthor().getPhoto())
            )
            .title(article.getTitle())
            .thumbnail(article.getThumbnail())
            .body(article.getBody())
            .summary(article.getSummary())
            .status(new StatusResponse(article.getStatus().getId(), article.getStatus().getName().name()))
            .categories(
                article.getCategories()
                    .stream()
                    .map(category -> new CategoryResponse(category.getId(), category.getName())).toList()
            )
            .updatedAt(article.getUpdatedAt())
            .createdAt(article.getCreatedAt())
            .build();
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class ProfileResponse {
        private Long id;
        private String name;
        private String photo;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class StatusResponse {
        private Long id;
        private String name;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class CategoryResponse {
        private Long id;
        private String name;
    }
}
