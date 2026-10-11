package com.forma.teammatcher.persistence;

import com.forma.teammatcher.model.Project;
import com.forma.teammatcher.model.ProjectSkill;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class ProjectEntity {
    @Id
    @Column(length = 32)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String client;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String deadline;

    @Column(name = "team_size", nullable = false)
    private int teamSize;

    @Column(nullable = false)
    private int filled;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String accent;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_skills", joinColumns = @JoinColumn(name = "project_id"))
    @OrderColumn(name = "skill_order")
    private List<ProjectSkillEntity> skills = new ArrayList<>();

    protected ProjectEntity() {
    }

    public ProjectEntity(Project project) {
        this.id = project.id();
        this.name = project.name();
        this.client = project.client();
        this.status = project.status();
        this.deadline = project.deadline();
        this.teamSize = project.teamSize();
        this.filled = project.filled();
        this.priority = project.priority();
        this.accent = project.accent();
        this.skills = new ArrayList<>(project.skills().stream().map(ProjectSkillEntity::new).toList());
    }

    public String getId() {
        return id;
    }

    public Project toModel() {
        List<ProjectSkill> projectSkills = skills.stream().map(ProjectSkillEntity::toModel).toList();
        return new Project(id, name, client, status, deadline, teamSize, filled, priority, accent, projectSkills);
    }
}
