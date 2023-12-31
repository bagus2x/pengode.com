package com.pengode.server.article.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateArticleRequest {
    @NotBlank
    @Size(max = 255)
    private String title;

    @Size(max = 511)
    private String Thumbnail;

    @NotBlank
    private String body;

    @NotBlank
    @Size(max = 511)
    private String summary;

    @NotEmpty
    private List<@Positive Long> categoryIds = new ArrayList<>();
}
