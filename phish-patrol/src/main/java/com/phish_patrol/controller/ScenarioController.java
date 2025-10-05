package com.phish_patrol.controller;

import com.phish_patrol.model.Scenario;
import com.phish_patrol.model.ScenarioType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScenarioController {

    @GetMapping("/api/scenarios/random")
    public Scenario testingScenario() {

        //I just made this to test what we have so far with Scenario
        return new Scenario(
            1L,
            ScenarioType.EMAIL,
            "From: noreply@mistpowered.com\nTo: Mary Smith\n\nDear Ms.Mary,\n\nThank you for your recent transaction.\nYour game is now in your Mist Libary.\n\nThanks!\nMist Games",
            false, 
            "the email comes from a reliable source with no clickable links.");
    }
}
