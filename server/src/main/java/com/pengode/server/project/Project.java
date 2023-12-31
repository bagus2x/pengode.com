package com.pengode.server.project;

import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
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
@Table(name = "project")
@EntityListeners({TimestampListener.class})
public class Project implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
        name = "demo",
        length = 511
    )
    private String demo;

    @Column(
        name = "body",
        nullable = false
    )
    @Lob
    private String body;

    @Column(
        name = "summary",
        nullable = false,
        length = 511
    )
    private String summary;

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

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "project_preview",
        joinColumns = @JoinColumn(name = "project_id")
    )
    private List<Preview> previews = Collections.emptyList();

    @NoArgsConstructor
    @AllArgsConstructor
    @Setter
    @Getter
    @Table(name = "project_preview")
    @Embeddable
    public static class Preview {
        @Column(
            unique = true,
            nullable = false
        )
        private String title;

        @Column(
            length = 511,
            nullable = false
        )
        private String image;
    }
}
