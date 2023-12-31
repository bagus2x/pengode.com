package com.pengode.server.articlestatus;

import com.pengode.server.article.Article;
import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "article_status")
@EntityListeners({TimestampListener.class})
public class ArticleStatus implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        name = "name",
        nullable = false,
        unique = true,
        length = 32
    )
    @Enumerated(EnumType.STRING)
    private Name name;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "status")
    private List<Article> articles;

    public enum Name {
        DRAFT,
        SCHEDULED,
        PUBLISHED,
        DELETED
    }
}
