package com.pengode.server.common.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "initializer")
@Data
public class InitializerProperties {
    private List<String> roles;
    private List<Map<String, String>> admins;
}
