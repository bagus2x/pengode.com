package com.pengode.server.article;

import com.pengode.server.articlestatus.ArticleStatus;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ArticleSpecification {

    @SuppressWarnings("unused")
    public static Specification<Article> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }

            return cb.or(
                cb.like(root.get("title"), STR."%\{search}%"),
                cb.like(root.get("summary"), STR."%\{search}%")
            );
        };
    }

    @SuppressWarnings("unused")
    public static Specification<Article> hasStatusIds(List<Long> statusIds) {
        return (root, query, cb) -> {
            if (statusIds.isEmpty()) {
                return null;
            }

            Join<Article, ArticleStatus> status = root.join("status");

            return status.get("id").in(statusIds);
        };
    }
}
