package com.pengode.server.project.dto.response;

import com.pengode.server.project.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ProjectResponse {
    private Long id;
    private ProfileResponse author;
    private String title;
    private String thumbnail;
    private String demo;
    private List<PreviewResponse> previews;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;


    public static ProjectResponse create(Project project) {
        return ProjectResponse.builder()
            .id(project.getId())
            .author(
                ProfileResponse.builder()
                    .id(project.getAuthor().getId())
                    .name(project.getAuthor().getName())
                    .photo(project.getAuthor().getPhoto())
                    .build()
            )
            .title(project.getTitle())
            .thumbnail(project.getThumbnail())
            .demo(project.getDemo())
            .previews(
                project.getPreviews()
                    .stream()
                    .map(preview -> new PreviewResponse(preview.getTitle(), preview.getImage())).toList()
            )
            .updatedAt(project.getUpdatedAt())
            .createdAt(project.getCreatedAt())
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
    public static class PreviewResponse {
        private String title;

        @NotBlank
        @Size(max = 511)
        private String image;
    }
}
