package com.pengode.server.privilige;

import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import com.pengode.server.role.Role;
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
@Table(name = "privilege")
@EntityListeners({TimestampListener.class})
public class Privilege implements TimestampAware {
    @Id
    @Column(
        name = "id",
        nullable = false
    )
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(
        name = "name",
        nullable = false,
        unique = true,
        length = 32
    )
    private String name;

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

    @ManyToMany(mappedBy = "privileges")
    private List<Role> roles = Collections.emptyList();
}
