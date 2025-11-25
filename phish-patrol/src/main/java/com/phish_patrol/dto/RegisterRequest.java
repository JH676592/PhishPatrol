package com.phish_patrol.dto;

public class RegisterRequest { 
    private String username;
    private String password;
    private String name;
    private String experience;

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
}
