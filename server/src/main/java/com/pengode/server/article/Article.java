package com.pengode.server.article;

import com.pengode.server.articlecategory.ArticleCategory;
import com.pengode.server.articlehistory.ArticleHistory;
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
import java.util.Collections;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "article")
@EntityListeners({TimestampListener.class})
public class Article implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(
        name = "title",
        nullable = false
    )
    private String title;

    @Column(
        name = "thumbnail",
        length = 511
    )
    private String thumbnail;

    @Column(
        name = "body",
        nullable = false,
        columnDefinition = "LONGTEXT"
    )
    @Lob
    private String body;

    @Column(
        name = "summary",
        nullable = false,
        length = 511
    )
    private String summary;

    @Column(name = "reading_time")
    private Integer readingTime;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

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

    @ManyToOne
    @JoinColumn(
        name = "author_id",
        nullable = false
    )
    private Profile author;

    @ManyToOne
    @JoinColumn(
        name = "status_id",
        nullable = false
    )
    private ArticleStatus status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "articles_categories",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<ArticleCategory> categories = Collections.emptyList();

    @OneToMany(
        mappedBy = "article",
        fetch = FetchType.EAGER
    )
    private List<ArticleHistory> histories = Collections.emptyList();
}
