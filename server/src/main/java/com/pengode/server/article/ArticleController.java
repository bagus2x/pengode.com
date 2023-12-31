package com.pengode.server.article;

import com.pengode.server.article.dto.request.CreateArticleRequest;
import com.pengode.server.article.dto.request.ScheduleArticleRequest;
import com.pengode.server.article.dto.request.UpdateArticleRequest;
import com.pengode.server.article.dto.response.ArticleResponse;
import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/article")
    public ArticleResponse create(@RequestBody CreateArticleRequest request) {
        return articleService.create(request);
    }

    @GetMapping("/article1")
    public PageRequest create(PageRequest request) {
        return request;
    }

    @GetMapping("/articles")
    @PreAuthorize("(hasRole('ADMIN') and #statusIds.size() != 0) or #statusIds.size() == 0")
    public PageResponse<ArticleResponse> getAll(
        PageRequest request,
        @RequestParam(
            name = "search",
            required = false
        )
        String search,
        @RequestParam(
            name = "status_id",
            required = false,
            defaultValue = ""
        )
        List<Long> statusIds
    ) {
        return articleService.getAll(request, search, statusIds);
    }

    @GetMapping("/article/{articleId}")
    @PostAuthorize("hasRole('ADMIN') or #returnObject.status.name == 'PUBLISHED'")
    public ArticleResponse getById(@PathVariable Long articleId) {
        return articleService.getById(articleId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/article/{articleId}")
    public ArticleResponse update(@PathVariable Long articleId, @RequestBody UpdateArticleRequest request) {
        return articleService.update(articleId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/article/{articleId}/draft")
    public ArticleResponse draft(@PathVariable Long articleId) {
        return articleService.draft(articleId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/article/{articleId}/schedule")
    public ArticleResponse schedule(@PathVariable Long articleId, @RequestBody ScheduleArticleRequest request) {
        return articleService.schedule(articleId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/article/{articleId}/publish")
    public ArticleResponse publish(@PathVariable Long articleId) {
        return articleService.publish(articleId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping({"/article/{articleId}", "/article/{articleId}/delete"})
    public ArticleResponse delete(
        @PathVariable Long articleId,
        @RequestParam(
            name = "permanent",
            defaultValue = "false",
            required = false
        )
        boolean permanent
    ) {
        return articleService.delete(articleId, permanent);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/article/{articleId}/restore")
    public ArticleResponse restore(@PathVariable Long articleId) {
        return articleService.restore(articleId);
    }
}
