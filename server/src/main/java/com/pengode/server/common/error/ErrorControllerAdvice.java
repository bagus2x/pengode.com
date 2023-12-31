package com.pengode.server.common.error;

import com.pengode.server.common.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class ErrorControllerAdvice {

    @ExceptionHandler(ResponseStatusException.class)
    public ErrorResponse exception(ResponseStatusException exception, HttpServletResponse response) {
        return mapError(
            exception.getStatusCode().value(),
            Collections.singleton(exception.getReason()),
            exception,
            response
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ErrorResponse exception(MethodArgumentTypeMismatchException exception, HttpServletResponse response) {
        return mapError(
            HttpStatus.BAD_REQUEST.value(),
            Collections.singleton("Invalid arguments " + exception.getName()),
            exception,
            response
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ErrorResponse exception(ConstraintViolationException exception, HttpServletResponse response) {
        Set<String> messages = exception.getConstraintViolations()
            .stream()
            .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
            .collect(Collectors.toSet());

        return mapError(
            HttpStatus.BAD_REQUEST.value(),
            messages,
            exception,
            response
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ErrorResponse exception(AuthenticationException exception, HttpServletResponse response) {
        if (exception.getCause() instanceof ResponseStatusException) {
            return exception((ResponseStatusException) exception.getCause(), response);
        }

        return mapError(
            HttpStatus.UNAUTHORIZED.value(),
            Collections.singleton(exception.getMessage()),
            exception,
            response
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ErrorResponse exception(AccessDeniedException exception, HttpServletResponse response) {
        return mapError(
            HttpStatus.FORBIDDEN.value(),
            Collections.singleton(exception.getMessage()),
            exception,
            response
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ErrorResponse exception(NoResourceFoundException exception, HttpServletResponse response) {
        return mapError(
            HttpStatus.NOT_FOUND.value(),
            Collections.singleton(exception.getMessage()),
            exception,
            response
        );
    }

    @ExceptionHandler(Exception.class)
    public ErrorResponse exception(Exception exception, HttpServletResponse response) {
        return mapError(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            Collections.singleton(exception.getMessage() != null ? exception.getMessage() : "Internal server error"),
            exception,
            response
        );
    }

    private ErrorResponse mapError(int code, Set<String> messages, Exception exception, HttpServletResponse response) {
        log.info("Exception {} occurred", exception.getClass(), exception);

        response.setStatus(code);

        return ErrorResponse.builder()
            .messages(messages)
            .code(code)
            .time(LocalDateTime.now())
            .build();
    }
}
