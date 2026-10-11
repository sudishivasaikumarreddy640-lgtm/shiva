package com.forma.teammatcher.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ProjectRequest(
        @NotBlank String name,
        @NotBlank String client,
        @NotBlank String deadline,
        @Min(1) int teamSize,
        @NotEmpty List<@Valid @NotNull ProjectSkill> skills) {
}