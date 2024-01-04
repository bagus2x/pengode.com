package com.pengode.server.project;

import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.project.dto.request.CreateProjectRequest;
import com.pengode.server.project.dto.response.ProjectResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/project")
    public ProjectResponse create(@RequestBody CreateProjectRequest request) {
        return projectService.create(request);
    }

    @GetMapping("/projects")
    public PageResponse<ProjectResponse> getAll(
        PageRequest request,
        @RequestParam(
            required = false,
            defaultValue = ""
        )
        String search
    ) {
        return projectService.getAll(request, search);
    }

    @GetMapping("/project/{projectId}")
    public ProjectResponse getById(@PathVariable Long projectId) {
        return projectService.getById(projectId);
    }
}
