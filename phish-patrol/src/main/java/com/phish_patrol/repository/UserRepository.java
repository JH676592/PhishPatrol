package com.phish_patrol.repository;

import com.phish_patrol.model.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> { 
    Optional<User> findByUsername(String username);
    List<User> findTop10By(Sort sort);
}