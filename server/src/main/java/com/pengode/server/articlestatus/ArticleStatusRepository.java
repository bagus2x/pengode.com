package com.pengode.server.articlestatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleStatusRepository extends JpaRepository<ArticleStatus, Long> {

    boolean existsByName(ArticleStatus.Name name);

    Optional<ArticleStatus> findByName(ArticleStatus.Name name);
}
