package com.pengode.server.common.jpa;

import java.time.LocalDateTime;

public interface TimestampAware {

    default void setUpdatedAt(LocalDateTime updatedAt) {
    }

    default void setCreatedAt(LocalDateTime createdAt) {
    }
}
