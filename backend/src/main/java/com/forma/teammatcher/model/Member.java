package com.forma.teammatcher.model;

import java.util.List;

public record Member(
        String id,
        String name,
        String role,
        String level,
        String location,
        int availability,
        List<String> skills,
        String initials,
        String color) {
}