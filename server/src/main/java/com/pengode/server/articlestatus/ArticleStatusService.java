package com.pengode.server.articlestatus;

import com.pengode.server.articlestatus.dto.response.ArticleStatusResponse;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ArticleStatusService {
    private final ArticleStatusRepository articleStatusRepository;

    public List<ArticleStatusResponse> getAll() {
        return articleStatusRepository.findAll()
            .stream()
            .map(ArticleStatusResponse::build)
            .toList();
    }
}
