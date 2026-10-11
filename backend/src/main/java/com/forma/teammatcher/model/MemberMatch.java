package com.forma.teammatcher.model;

import java.util.List;

public record MemberMatch(
        String id,
        String name,
        String role,
        String level,
        String location,
        int availability,
        List<String> skills,
        String initials,
        String color,
        int matchScore) {
    public static MemberMatch from(Member member, int score) {
        return new MemberMatch(member.id(), member.name(), member.role(), member.level(), member.location(),
                member.availability(), member.skills(), member.initials(), member.color(), score);
    }
}