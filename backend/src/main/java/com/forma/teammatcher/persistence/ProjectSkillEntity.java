package com.forma.teammatcher.persistence;

import com.forma.teammatcher.model.ProjectSkill;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProjectSkillEntity {
    @Column(name = "skill_name", nullable = false)
    private String name;

    @Column(name = "skill_level", nullable = false)
    private String level;

    @Column(name = "skill_count", nullable = false)
    private int count;

    protected ProjectSkillEntity() {
    }

    public ProjectSkillEntity(ProjectSkill skill) {
        this.name = skill.name();
        this.level = skill.level();
        this.count = skill.count();
    }

    public ProjectSkill toModel() {
        return new ProjectSkill(name, level, count);
    }
}
