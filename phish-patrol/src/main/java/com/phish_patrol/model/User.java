package com.phish_patrol.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String username;

    private String passwordHash;

    private String name;

    private String experience;

    private int score;

    public User() {}

    public User(String username, String passwordHash, String name, String experience) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.name = name;
        this.experience = experience;
        this.score = 0;
    }

    // getters and setters
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getName() { return name; }
    public String getExperience() { return experience; }
    public int getScore() { return score; }

    public void setUsername(String username) { this.username = username; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setName(String name) { this.name = name; }
    public void setExperience(String experience) {this.experience = experience; }
    public void setScore(int score) { this.score = score; }
}