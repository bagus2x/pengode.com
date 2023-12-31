package com.pengode.server.common.dto.response;

import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@With
public class PageResponse<T> {
    private Integer page;
    private Integer size;
    private List<T> data;

    public static <T> PageResponse<T> create(Page<T> page) {
        return PageResponse.<T>builder()
            .page(page.getNumber())
            .size(page.getSize())
            .data(page.getContent())
            .build();
    }
}
