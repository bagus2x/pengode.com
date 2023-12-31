package com.pengode.server.profile;

import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import com.pengode.server.user.User;
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
@Table(name = "profile")
@EntityListeners({TimestampListener.class})
public class Profile implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    private Long id;

    @Column(
        name = "name",
        length = 127
    )
    private String name;

    @Column(
        name = "photo",
        length = 511
    )
    private String photo;

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

    @OneToOne
    @MapsId
    @JoinColumn(
        name = "id",
        nullable = false
    )
    private User user;
}
