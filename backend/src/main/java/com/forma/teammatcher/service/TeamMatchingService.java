package com.forma.teammatcher.service;

import com.forma.teammatcher.model.Member;
import com.forma.teammatcher.model.MemberMatch;
import com.forma.teammatcher.model.Project;
import com.forma.teammatcher.model.ProjectRequest;
import com.forma.teammatcher.model.ProjectSkill;
import com.forma.teammatcher.persistence.MemberEntity;
import com.forma.teammatcher.persistence.MemberRepository;
import com.forma.teammatcher.persistence.ProjectEntity;
import com.forma.teammatcher.persistence.ProjectRepository;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamMatchingService {
    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;

    public TeamMatchingService(ProjectRepository projectRepository, MemberRepository memberRepository) {
        this.projectRepository = projectRepository;
        this.memberRepository = memberRepository;
    }

    @PostConstruct
    void seed() {
        if (projectRepository.count() == 0) {
            projectRepository.saveAll(List.of(
                    project(new Project("PX-204", "Customer intelligence", "Northstar Health", "Staffing", "Oct 28, 2026", 5, 3, "High", "mint", List.of(skill("React", "Advanced"), skill("Python", "Advanced"), skill("Data engineering", "Intermediate"), skill("Product design", "Intermediate")))),
                    project(new Project("PX-198", "Atlas mobile banking", "Meridian Credit", "In progress", "Nov 14, 2026", 7, 5, "Medium", "peach", List.of(skill("React Native", "Advanced"), skill("Java", "Advanced"), skill("AWS", "Intermediate")))),
                    project(new Project("PX-187", "Sustainable supply chain", "Common Ground", "Staffing", "Dec 02, 2026", 4, 2, "Medium", "blue", List.of(skill("Machine learning", "Advanced"), skill("Python", "Intermediate"), skill("UX research", "Intermediate")))),
                    project(new Project("PX-176", "Operations redesign", "Fieldwork Co.", "In progress", "Jan 09, 2027", 6, 4, "Low", "lavender", List.of(skill("Service design", "Advanced"), skill("Figma", "Intermediate"))))
            ));
        }
        if (memberRepository.count() == 0) {
            memberRepository.saveAll(List.of(
                    member("TM-041", "Amara Okafor", "Frontend engineer", "Senior", "Brooklyn, NY", 80, "AO", "coral", "React", "TypeScript", "Design systems", "Accessibility"),
                    member("TM-018", "Leo Martínez", "Data engineer", "Senior", "Austin, TX", 100, "LM", "blue", "Python", "Data engineering", "dbt", "AWS"),
                    member("TM-052", "Priya Nair", "Product designer", "Mid-level", "Toronto, CA", 60, "PN", "yellow", "Product design", "Figma", "UX research", "Prototyping"),
                    member("TM-033", "Noah Kim", "Machine learning engineer", "Senior", "Seattle, WA", 100, "NK", "mint", "Machine learning", "Python", "MLOps", "AWS"),
                    member("TM-027", "Sofia Chen", "Full-stack engineer", "Mid-level", "San Francisco, CA", 40, "SC", "lavender", "React", "Java", "Node.js", "PostgreSQL"),
                    member("TM-061", "Ethan Brooks", "UX researcher", "Senior", "Chicago, IL", 80, "EB", "peach", "UX research", "Service design", "Figma", "Facilitation"),
                    member("TM-039", "Mila Petrova", "Backend engineer", "Mid-level", "Denver, CO", 100, "MP", "blue", "Java", "Spring Boot", "AWS", "PostgreSQL"),
                    member("TM-044", "Jules Rivera", "Product designer", "Senior", "Portland, OR", 80, "JR", "coral", "Product design", "Figma", "Design systems", "UX research")
            ));
        }
    }

    public List<Project> getProjects() {
        return projectRepository.findAll().stream()
                .sorted(Comparator.comparingInt((ProjectEntity project) -> projectNumber(project.getId())).reversed())
                .map(ProjectEntity::toModel)
                .toList();
    }

    public List<Member> getMembers() {
        return memberRepository.findAll().stream().map(MemberEntity::toModel).toList();
    }

    @Transactional
    public Project createProject(ProjectRequest request) {
        int nextId = projectRepository.findAll().stream()
                .mapToInt(project -> projectNumber(project.getId()))
                .max()
                .orElse(204) + 1;
        Project project = new Project("PX-" + nextId, request.name(), request.client(), "Staffing",
                request.deadline(), request.teamSize(), 0, "Medium", "mint", request.skills());
        return projectRepository.save(new ProjectEntity(project)).toModel();
    }

    public List<MemberMatch> getMatches(String projectId) {
        Project project = projectRepository.findById(projectId)
                .map(ProjectEntity::toModel)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
        List<MemberMatch> matches = new ArrayList<>();
        for (Member member : getMembers()) {
            int score = score(member, project);
            if (score > 0) matches.add(MemberMatch.from(member, score));
        }
        matches.sort(Comparator.comparingInt(MemberMatch::matchScore).reversed());
        return matches;
    }

    private int score(Member member, Project project) {
        if (project.skills().isEmpty()) return 0;
        long matched = project.skills().stream().filter(required -> member.skills().stream()
                .anyMatch(held -> held.equalsIgnoreCase(required.name()))).count();
        int skillScore = (int) Math.round((double) matched / project.skills().size() * 70);
        int availabilityScore = (int) Math.round(member.availability() / 100.0 * 20);
        boolean advancedNeeded = project.skills().stream().anyMatch(skill -> "Advanced".equalsIgnoreCase(skill.level()));
        int seniorityScore = advancedNeeded && "Senior".equalsIgnoreCase(member.level()) ? 10 : 6;
        return Math.min(99, skillScore + availabilityScore + seniorityScore);
    }

    private static int projectNumber(String id) {
        return Integer.parseInt(id.substring("PX-".length()));
    }

    private static ProjectEntity project(Project project) {
        return new ProjectEntity(project);
    }

    private static ProjectSkill skill(String name, String level) {
        return new ProjectSkill(name, level, 1);
    }

    private static MemberEntity member(String id, String name, String role, String level, String location, int availability,
                                       String initials, String color, String... skills) {
        return new MemberEntity(new Member(id, name, role, level, location, availability, List.of(skills), initials, color));
    }
}
