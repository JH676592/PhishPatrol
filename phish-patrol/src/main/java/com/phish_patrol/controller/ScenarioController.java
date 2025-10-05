package com.phish_patrol.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phish_patrol.model.Scenario;
import com.phish_patrol.model.ScenarioType;

@RestController
public class ScenarioController {
    
    Scenario TemporaryScenarioObj = new Scenario(
        1L,
        ScenarioType.EMAIL,
        "This is a fake Netflix renewal email asking you to update payment info.",
        true,
        "Scammers mimic real brands and create urgency to trick users."
    );

    @RequestMapping("/randomScenario")
    public Scenario getScenario() {
        return TemporaryScenarioObj;
    }
}
