package com.forma.teammatcher.model;

import java.util.List;

public record Project(
        String id,
        String name,
        String client,
        String status,
        String deadline,
        int teamSize,
        int filled,
        String priority,
        String accent,
        List<ProjectSkill> skills) {
}