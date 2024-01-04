package com.pengode.server.project;

import com.pengode.server.auth.security.AuthUser;
import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.project.dto.request.CreateProjectRequest;
import com.pengode.server.project.dto.response.ProjectResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

import static com.pengode.server.project.ProjectSpecification.search;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final Validator validator;

    @Transactional
    public ProjectResponse create(CreateProjectRequest request) {
        Set<ConstraintViolation<CreateProjectRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setThumbnail(request.getThumbnail());
        project.setDemo(request.getDemo());

        List<Project.Preview> previews = request.getPreviews()
            .stream()
            .map(preview -> new Project.Preview(preview.getTitle(), preview.getImage())).toList();
        project.setPreviews(previews);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        project.setAuthor(authUser.getUser().getProfile());

        project = projectRepository.save(project);

        return ProjectResponse.create(project);
    }

    public PageResponse<ProjectResponse> getAll(PageRequest request, String search) {
        Page<Project> projects = projectRepository.findAll(search(search), request.pageable());

        return PageResponse.create(projects.map(ProjectResponse::create));
    }

    public ProjectResponse getById(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project is not found"));

        return ProjectResponse.create(project);
    }
}
