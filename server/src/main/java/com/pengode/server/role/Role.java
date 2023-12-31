package com.pengode.server.role;


import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import com.pengode.server.privilige.Privilege;
import com.pengode.server.user.User;
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
@Table(name = "role")
@EntityListeners({TimestampListener.class})
public class Role implements TimestampAware {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(
        name = "id",
        nullable = false
    )
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

    @ManyToMany(mappedBy = "roles")
    private List<User> users = Collections.emptyList();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_privilege",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "privilege_id")
    )
    private List<Privilege> privileges = Collections.emptyList();
}
