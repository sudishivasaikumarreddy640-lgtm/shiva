package com.forma.teammatcher.api;

import com.forma.teammatcher.model.MemberMatch;
import com.forma.teammatcher.model.Project;
import com.forma.teammatcher.model.ProjectRequest;
import com.forma.teammatcher.service.TeamMatchingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProjectController {
    private final TeamMatchingService matchingService;

    public ProjectController(TeamMatchingService matchingService) { this.matchingService = matchingService; }

    @GetMapping
    public List<Project> getProjects() { return matchingService.getProjects(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody ProjectRequest request) {
        return matchingService.createProject(request);
    }

    @GetMapping("/{projectId}/matches")
    public List<MemberMatch> getMatches(@PathVariable String projectId) {
        return matchingService.getMatches(projectId);
    }
}