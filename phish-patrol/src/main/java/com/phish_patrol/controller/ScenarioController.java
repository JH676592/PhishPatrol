package com.phish_patrol.controller;

import com.phish_patrol.model.Scenario;
import com.phish_patrol.model.ScenarioType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScenarioController {
    @RequestMapping(
            method = RequestMethod.GET,
            value = "/api/scenarios/random",
            produces = {"application/json"}
    )
    public Scenario getRandomScenario(){
        return new Scenario(1L, ScenarioType.SMS, "apple", true, "Apple is blue");
    }
}
