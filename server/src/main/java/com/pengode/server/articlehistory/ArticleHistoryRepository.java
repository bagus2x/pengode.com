package com.pengode.server.articlehistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleHistoryRepository extends JpaRepository<ArticleHistory, Long> {
}
