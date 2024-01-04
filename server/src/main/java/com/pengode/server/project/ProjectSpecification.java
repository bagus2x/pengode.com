package com.pengode.server.project;

import org.springframework.data.jpa.domain.Specification;

public class ProjectSpecification {

    @SuppressWarnings("unused")
    public static Specification<Project> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return null;
            }

            return cb.or(
                cb.like(root.get("title"), STR."%\{search}%"),
                cb.like(root.get("body"), STR."%\{search}%")
            );
        };
    }
}
