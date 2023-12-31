package com.pengode.server.common.resolver;

import com.pengode.server.common.dto.request.PageRequest;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Objects;

@Component
public class PageRequestResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(PageRequest.class);
    }

    @Override
    public Object resolveArgument(
        @NonNull MethodParameter parameter,
        ModelAndViewContainer mavContainer,
        @NonNull NativeWebRequest webRequest,
        WebDataBinderFactory binderFactory
    ) {
        PageRequest pageRequest = new PageRequest();
        Map<String, String[]> parameterMap = webRequest.getParameterMap();
        pageRequest.setFilters(parameterMap);

        for (var entry : parameterMap.entrySet()) {
            if (entry.getKey().startsWith("order.") && entry.getKey().length() != 6 && entry.getValue().length == 1) {
                String column = entry.getKey().split("order.")[1];
                String direction = entry.getValue()[0];
                pageRequest.getOrders().put(column, direction);
            }
        }

        if (webRequest.getParameter("size") != null) {
            try {
                pageRequest.setSize(Integer.parseInt(Objects.requireNonNull(webRequest.getParameter("size"))));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide correct page size");
            }
        }

        if (webRequest.getParameter("page") != null) {
            try {
                pageRequest.setPage(Integer.parseInt(Objects.requireNonNull(webRequest.getParameter("page"))));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide correct page number");
            }
        }

        return pageRequest;
    }
}
