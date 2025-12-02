package com.phish_patrol.controller;

import com.phish_patrol.dto.LoginRequest;
import com.phish_patrol.dto.RegisterRequest;
import com.phish_patrol.model.User;
import com.phish_patrol.repository.UserRepository;
import com.phish_patrol.service.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setExperience(request.getExperience());
        user.setScore(0);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            //
            String token = jwtTokenProvider.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());
            return ResponseEntity.ok().body("{\"token\":\"" + token + "\"}");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    static class ScoreRequest {
        private String username;
        private int scoreIncrement;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public int getScoreIncrement() { return scoreIncrement; }
        public void setScoreIncrement(int scoreIncrement) { this.scoreIncrement = scoreIncrement; }
    }

    @PostMapping("/save-score")
    public ResponseEntity<String> saveScore(@RequestBody ScoreRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null); 
        
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found for scoring.");
        }

        int currentScore = user.getScore();
        int pointsGained = request.getScoreIncrement();
        int newScore = currentScore + pointsGained;
        
        user.setScore(newScore);
        userRepository.save(user);

        return ResponseEntity.ok("Score updated to " + newScore + ".");
    }

    @GetMapping("/leaderboard")
    public List<User> getLeaderboard() {
        Sort sort = Sort.by(Sort.Direction.DESC, "score"); 
        return userRepository.findTop10By(sort);
    }
}
