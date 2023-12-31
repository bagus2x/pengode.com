package com.pengode.server.articlestatus;

import com.pengode.server.articlestatus.dto.response.ArticleStatusResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class ArticleStatusController {
    private ArticleStatusService articleStatusService;

    @GetMapping("/article-statuses")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ArticleStatusResponse> getAll() {
        return articleStatusService.getAll();
    }
}
