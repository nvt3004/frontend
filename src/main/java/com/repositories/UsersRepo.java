package com.repositories;


import com.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneAndProvider(String phone, String provider);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailAndProvider(String email, String provider);

    Optional<User> findByResetToken(String token);
}
