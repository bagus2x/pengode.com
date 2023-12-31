package com.pengode.server.articlecategory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateCategoryRequest {
    @NotBlank
    @Size(max = 15)
    private String name;

    @NotBlank
    @Size(min = 7, max = 7)
    private String color;
}
