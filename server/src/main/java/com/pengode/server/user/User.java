package com.pengode.server.user;

import com.pengode.server.common.jpa.TimestampAware;
import com.pengode.server.common.jpa.TimestampListener;
import com.pengode.server.profile.Profile;
import com.pengode.server.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "user")
@EntityListeners({TimestampListener.class})
public class User implements TimestampAware {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(
        name = "id",
        nullable = false
    )
    private Long id;

    @Column(
        name = "email",
        nullable = false,
        unique = true,
        length = 127
    )
    private String email;

    @Column(
        name = "username",
        nullable = false,
        unique = true,
        length = 32
    )
    private String username;

    @Column(
        name = "password",
        length = 127
    )
    private String password;

    @Column(
        name = "is_enabled",
        nullable = false
    )
    @Accessors(fluent = true)
    private Boolean isEnabled = false;

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

    @OneToOne(
        mappedBy = "user",
        cascade = CascadeType.ALL
    )
    @PrimaryKeyJoinColumn
    private Profile profile;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_role",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = Collections.emptyList();
}
