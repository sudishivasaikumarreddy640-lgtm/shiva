package com.forma.teammatcher.persistence;

import com.forma.teammatcher.model.Member;
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
@Table(name = "members")
public class MemberEntity {
    @Id
    @Column(length = 32)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private int availability;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "member_skills", joinColumns = @JoinColumn(name = "member_id"))
    @OrderColumn(name = "skill_order")
    @Column(name = "skill_name", nullable = false)
    private List<String> skills = new ArrayList<>();

    @Column(nullable = false)
    private String initials;

    @Column(nullable = false)
    private String color;

    protected MemberEntity() {
    }

    public MemberEntity(Member member) {
        this.id = member.id();
        this.name = member.name();
        this.role = member.role();
        this.level = member.level();
        this.location = member.location();
        this.availability = member.availability();
        this.skills = new ArrayList<>(member.skills());
        this.initials = member.initials();
        this.color = member.color();
    }

    public Member toModel() {
        return new Member(id, name, role, level, location, availability, List.copyOf(skills), initials, color);
    }
}
