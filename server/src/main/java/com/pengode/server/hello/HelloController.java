package com.pengode.server.hello;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        AnonymousAuthenticationToken authenticationToken = (org.springframework.security.authentication.AnonymousAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        System.out.println("HELLO " + authenticationToken.getPrincipal());
        System.out.println("HELLO " + authenticationToken.getDetails());
        System.out.println("HELLO " + authenticationToken.getCredentials());
        System.out.println("HELLO " + authenticationToken.getAuthorities());
        return "Hello, World!";
    }
}
