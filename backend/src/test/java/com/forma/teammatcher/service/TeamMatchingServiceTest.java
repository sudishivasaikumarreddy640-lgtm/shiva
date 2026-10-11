package com.forma.teammatcher.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.forma.teammatcher.model.Member;
import com.forma.teammatcher.model.MemberMatch;
import com.forma.teammatcher.model.Project;
import com.forma.teammatcher.model.ProjectRequest;
import com.forma.teammatcher.model.ProjectSkill;
import com.forma.teammatcher.persistence.MemberEntity;
import com.forma.teammatcher.persistence.MemberRepository;
import com.forma.teammatcher.persistence.ProjectEntity;
import com.forma.teammatcher.persistence.ProjectRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamMatchingServiceTest {
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private MemberRepository memberRepository;
    private TeamMatchingService service;

    @BeforeEach
    void setUp() {
        service = new TeamMatchingService(projectRepository, memberRepository);
    }

    @Test
    void ranksMembersBySkillCoverageAndAvailability() {
        Project project = new Project("PX-204", "Customer intelligence", "Northstar Health", "Staffing",
                "Oct 28, 2026", 5, 3, "High", "mint",
                List.of(new ProjectSkill("Python", "Advanced", 1), new ProjectSkill("Data engineering", "Intermediate", 1)));
        Member leo = new Member("TM-018", "Leo Martínez", "Data engineer", "Senior", "Austin, TX", 100,
                List.of("Python", "Data engineering"), "LM", "blue");
        Member amara = new Member("TM-041", "Amara Okafor", "Frontend engineer", "Senior", "Brooklyn, NY", 80,
                List.of("React"), "AO", "coral");
        when(projectRepository.findById("PX-204")).thenReturn(java.util.Optional.of(new ProjectEntity(project)));
        when(memberRepository.findAll()).thenReturn(List.of(new MemberEntity(amara), new MemberEntity(leo)));

        List<MemberMatch> matches = service.getMatches("PX-204");

        assertEquals("Leo Martínez", matches.get(0).name());
        assertTrue(matches.get(0).matchScore() > matches.get(1).matchScore());
    }

    @Test
    void createsProjectWithAnOpenTeamAndGeneratedId() {
        when(projectRepository.findAll()).thenReturn(List.of(new ProjectEntity(new Project("PX-204", "Existing",
                "Forma", "Staffing", "Nov 30, 2026", 3, 0, "Medium", "mint", List.of()))));
        when(projectRepository.save(any(ProjectEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        ProjectRequest request = new ProjectRequest("New platform", "Forma", "Nov 30, 2026", 3,
                List.of(new ProjectSkill("React", "Advanced", 1)));

        Project created = service.createProject(request);

        assertEquals("PX-205", created.id());
        assertEquals(0, created.filled());
        assertEquals("Staffing", created.status());
        verify(projectRepository).save(any(ProjectEntity.class));
    }
}