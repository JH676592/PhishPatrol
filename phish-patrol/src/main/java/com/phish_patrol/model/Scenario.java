package com.phish_patrol.model;

public record Scenario(
        Long id,
        ScenarioType type,
        String content,
        boolean isScam,
        String explanation
) {}
