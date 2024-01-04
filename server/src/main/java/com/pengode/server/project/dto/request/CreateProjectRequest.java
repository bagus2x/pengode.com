package com.pengode.server.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateProjectRequest {
    @Size(max = 511)
    private String title;

    @Size(max = 511)
    private String thumbnail;

    @Size(max = 511)
    private String demo;

    private List<PreviewRequest> previews;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class PreviewRequest {
        private String title;

        @NotBlank
        @Size(max = 511)
        private String image;
    }
}
