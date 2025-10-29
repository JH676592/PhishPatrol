package com.phish_patrol.repository;

import com.phish_patrol.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // user entities with primary key type long
}