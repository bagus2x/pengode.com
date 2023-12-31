package com.pengode.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
@Slf4j
public class PengodeApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(PengodeApplication.class, args);
        Environment environment = context.getBean(Environment.class);

        String name = environment.getProperty("spring.application.name");
        log.info(STR."\{name} is running");
    }
}

