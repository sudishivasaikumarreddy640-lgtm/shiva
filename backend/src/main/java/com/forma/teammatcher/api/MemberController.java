package com.forma.teammatcher.api;

import com.forma.teammatcher.model.Member;
import com.forma.teammatcher.service.TeamMatchingService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class MemberController {
    private final TeamMatchingService matchingService;

    public MemberController(TeamMatchingService matchingService) { this.matchingService = matchingService; }

    @GetMapping
    public List<Member> getMembers() { return matchingService.getMembers(); }
}