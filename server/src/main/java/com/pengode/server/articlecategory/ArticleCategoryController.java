package com.pengode.server.articlecategory;

import com.pengode.server.articlecategory.dto.request.CreateCategoryRequest;
import com.pengode.server.articlecategory.dto.response.ArticleCategoryResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class ArticleCategoryController {
    private ArticleCategoryService articleCategoryService;

    @PostMapping("/article-category")
    public ArticleCategoryResponse create(@RequestBody CreateCategoryRequest request) {
        return articleCategoryService.create(request);
    }

    @GetMapping("/article-categories")
    public List<ArticleCategoryResponse> getAll() {
        return articleCategoryService.getAll();
    }
}
