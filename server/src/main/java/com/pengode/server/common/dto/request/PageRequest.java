package com.pengode.server.common.dto.request;

import lombok.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.springframework.data.domain.PageRequest.of;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@With
public class PageRequest {
    private Integer page = 0;
    private Integer size = 20;
    private Map<String, String> orders = new HashMap<>();
    private Map<String, String[]> filters = new HashMap<>();

    public Pageable pageable() {
        if (orders.isEmpty()) {
            return of(page, size);
        }

        List<Sort.Order> orders = new ArrayList<>();
        this.orders.forEach((column, direction) -> {
            if (direction.equalsIgnoreCase("asc")) orders.add(Sort.Order.asc(column));
            else if (direction.equalsIgnoreCase("desc")) orders.add(Sort.Order.desc(column));
            else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Direction " + direction + " is not valid");
        });

        return of(page, size, Sort.by(orders));
    }

    public List<String> getStringValues(String key) {
        try {
            return Arrays.stream(filters.get(key)).toList();
        } catch (Exception exception) {
            return Collections.emptyList();
        }
    }

    public String getStringValue(String key) {
        try {
            return filters.get(key)[0];
        } catch (Exception exception) {
            return null;
        }
    }

    public List<Long> getLongValues(String key) {
        try {
            return Arrays.stream(filters.get(key)).map(Long::parseLong).toList();
        } catch (Exception exception) {
            return Collections.emptyList();
        }
    }

    public Long getLongValue(String key) {
        try {
            return Long.parseLong(filters.get(key)[0]);
        } catch (Exception exception) {
            return null;
        }
    }
}
