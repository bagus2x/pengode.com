package com.pengode.server.articlecategory;

import com.pengode.server.articlecategory.dto.request.CreateCategoryRequest;
import com.pengode.server.articlecategory.dto.response.ArticleCategoryResponse;
import com.pengode.server.auth.security.AuthUser;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class ArticleCategoryService {
    private final ArticleCategoryRepository articleCategoryRepository;
    private final Validator validator;

    @Transactional
    public ArticleCategoryResponse create(CreateCategoryRequest request) {
        Set<ConstraintViolation<CreateCategoryRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        if (articleCategoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Name already exists");
        }

        ArticleCategory category = new ArticleCategory();
        category.setName(request.getName());
        category.setColor(request.getColor());

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        category.setAuthor(authUser.getUser().getProfile());

        category = articleCategoryRepository.save(category);

        return ArticleCategoryResponse.build(category);
    }

    public List<ArticleCategoryResponse> getAll() {
        return articleCategoryRepository.findAll()
            .stream()
            .map(ArticleCategoryResponse::build)
            .toList();
    }
}
