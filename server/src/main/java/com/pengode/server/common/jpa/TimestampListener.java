package com.pengode.server.common.jpa;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
public class TimestampListener {

    @PreUpdate
    public void setUpdatedAt(Object entity) {
        if (entity instanceof TimestampAware) {
            ((TimestampAware) entity).setUpdatedAt(LocalDateTime.now());
        } else {
            log.error("Failed to cast {} to {}", entity.getClass().getName(), TimestampAware.class.getName());
        }
    }

    @PrePersist
    public void setCreatedAt(Object entity) {
        if (entity instanceof TimestampAware) {
            LocalDateTime time = LocalDateTime.now();

            ((TimestampAware) entity).setUpdatedAt(time);
            ((TimestampAware) entity).setCreatedAt(time);
        } else {
            log.error("Failed to cast {} to {}", entity.getClass().getName(), TimestampAware.class.getName());
        }
    }
}
