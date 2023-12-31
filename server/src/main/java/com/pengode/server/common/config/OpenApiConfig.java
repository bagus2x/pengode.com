package com.pengode.server.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .components(new Components().addSecuritySchemes("API_KEY", apiKeySecuritySchema()))
            .info(
                new Info()
                    .title("Title API")
                    .description("Pengode services documentation with OpenAPI 3.")
            );
    }

    public SecurityScheme apiKeySecuritySchema() {
        return new SecurityScheme()
            .name("Authorization")
            .description("Using bearer token")
            .in(SecurityScheme.In.HEADER)
            .type(SecurityScheme.Type.APIKEY);
    }
}
