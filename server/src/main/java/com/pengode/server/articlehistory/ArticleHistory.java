package com.pengode.server.articlehistory;

import com.pengode.server.article.Article;
import com.pengode.server.articlestatus.ArticleStatus;
import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import com.pengode.server.profile.Profile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "article_history")
@EntityListeners({TimestampListener.class})
public class ArticleHistory implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(
        name = "article_id",
        nullable = false
    )
    private Article article;

    @ManyToOne
    @JoinColumn(
        name = "status_id",
        nullable = false
    )
    private ArticleStatus status;

    @ManyToOne
    @JoinColumn(
        name = "editor_id",
        nullable = false
    )
    private Profile editor;

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt = LocalDateTime.now();
}
