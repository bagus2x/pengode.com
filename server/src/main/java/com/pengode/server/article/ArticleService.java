package com.pengode.server.article;

import com.pengode.server.article.dto.request.CreateArticleRequest;
import com.pengode.server.article.dto.request.ScheduleArticleRequest;
import com.pengode.server.article.dto.request.UpdateArticleRequest;
import com.pengode.server.article.dto.response.ArticleResponse;
import com.pengode.server.articlecategory.ArticleCategory;
import com.pengode.server.articlecategory.ArticleCategoryRepository;
import com.pengode.server.articlehistory.ArticleHistory;
import com.pengode.server.articlehistory.ArticleHistoryRepository;
import com.pengode.server.articlestatus.ArticleStatus;
import com.pengode.server.articlestatus.ArticleStatusRepository;
import com.pengode.server.auth.security.AuthUser;
import com.pengode.server.common.dto.request.PageRequest;
import com.pengode.server.common.dto.response.PageResponse;
import com.pengode.server.profile.Profile;
import com.pengode.server.profile.ProfileRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.pengode.server.article.ArticleSpecification.hasStatusIds;
import static com.pengode.server.article.ArticleSpecification.search;

@Service
@AllArgsConstructor
public class ArticleService {
    private final ArticleRepository articleRepository;
    private final ProfileRepository profileRepository;
    private final ArticleStatusRepository articleStatusRepository;
    private final ArticleHistoryRepository articleHistoryRepository;
    private final Validator validator;
    private final ArticleCategoryRepository articleCategoryRepository;
    private final TaskScheduler taskScheduler;

    @Transactional
    public ArticleResponse create(CreateArticleRequest request) {
        Set<ConstraintViolation<CreateArticleRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setThumbnail(request.getThumbnail());
        article.setBody(request.getBody());
        article.setSummary(request.getSummary());
        article.setReadingTime(request.getReadingTime());

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        Profile author = profileRepository.findById(authUser.getUser().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Author is not found"));
        article.setAuthor(author);

        List<ArticleCategory> categories = request.getCategoryIds()
            .stream()
            .map(categoryId -> articleCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category is not found"))
            ).toList();
        article.setCategories(categories);

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.DRAFT)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);

        article = articleRepository.save(article);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);
        history.setEditor(author);

        articleHistoryRepository.save(history);

        return ArticleResponse.create(article);
    }

    public PageResponse<ArticleResponse> getAll(PageRequest request, String search, List<Long> statusIds) {
        if (statusIds.isEmpty()) {
            ArticleStatus publishedStatus = articleStatusRepository.findByName(ArticleStatus.Name.PUBLISHED)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
            statusIds.add(publishedStatus.getId());
        }

        Specification<Article> specification = hasStatusIds(statusIds).and(search(search));

        Page<Article> posts = articleRepository.findAll(specification, request.pageable());

        return PageResponse.create(posts.map(ArticleResponse::create));
    }

    public ArticleResponse getById(Long postId) {
        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse update(Long postId, UpdateArticleRequest request) {
        Set<ConstraintViolation<UpdateArticleRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));
        article.setTitle(request.getTitle());
        article.setThumbnail(request.getThumbnail());
        article.setBody(request.getBody());
        article.setSummary(request.getSummary());
        article.setReadingTime(request.getReadingTime());

        List<ArticleCategory> categories = request.getCategoryIds()
            .stream()
            .map(categoryId -> articleCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category is not found"))
            ).collect(Collectors.toList());
        article.setCategories(categories);

        article = articleRepository.save(article);

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse draft(Long postId) {
        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        if (article.getStatus().getName() != ArticleStatus.Name.PUBLISHED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, STR."Cannot draft article with status \{article.getStatus().getName()}");
        }

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.DRAFT)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);

        article = articleRepository.save(article);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        history.setEditor(authUser.getUser().getProfile());

        articleHistoryRepository.save(history);

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse schedule(Long postId, ScheduleArticleRequest request) {
        Set<ConstraintViolation<ScheduleArticleRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        if (article.getStatus().getName() != ArticleStatus.Name.DRAFT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, STR."Cannot schedule article with status \{article.getStatus().getName()}");
        }

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.SCHEDULED)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);
        article.setScheduledAt(Instant.ofEpochMilli(request.getTime()).atZone(ZoneId.systemDefault()).toLocalDateTime());

        article = articleRepository.save(article);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        history.setEditor(authUser.getUser().getProfile());

        articleHistoryRepository.save(history);

        taskScheduler.schedule(() -> publish(postId), Instant.ofEpochMilli(request.getTime()));

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse publish(Long postId) {
        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        if ((article.getStatus().getName() != ArticleStatus.Name.DRAFT) && (article.getStatus().getName() != ArticleStatus.Name.SCHEDULED)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, STR."Cannot publish article with status \{article.getStatus().getName()}");
        }

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.PUBLISHED)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);

        article = articleRepository.save(article);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        Profile editor = profileRepository.findById(authUser.getUser().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Editor is not found"));
        article.setAuthor(editor);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);
        history.setEditor(editor);

        articleHistoryRepository.save(history);

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse delete(Long postId, boolean permanent) {
        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        if (permanent) {
            articleRepository.deleteById(article.getId());
            return ArticleResponse.create(article);
        }

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.DELETED)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);

        article = articleRepository.save(article);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        history.setEditor(authUser.getUser().getProfile());

        articleHistoryRepository.save(history);

        return ArticleResponse.create(article);
    }

    @Transactional
    public ArticleResponse restore(Long postId) {
        Article article = articleRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article is not found"));

        if (article.getStatus().getName() != ArticleStatus.Name.DELETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, STR."Cannot restore article with status \{article.getStatus().getName()}");
        }

        ArticleStatus status = articleStatusRepository.findByName(ArticleStatus.Name.DRAFT)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article status is not found"));
        article.setStatus(status);

        article = articleRepository.save(article);

        ArticleHistory history = new ArticleHistory();
        history.setArticle(article);
        history.setStatus(status);

        AuthUser authUser = (AuthUser) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        history.setEditor(authUser.getUser().getProfile());

        articleHistoryRepository.save(history);

        return ArticleResponse.create(article);
    }
}
