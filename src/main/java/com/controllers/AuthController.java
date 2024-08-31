package com.controllers;

import com.models.EmailRequestDTO;
import com.repositories.UsersRepo;
import com.models.AuthDTO;
import com.entities.User;
import com.services.AuthManagementService;
import com.services.MailService;
import com.utils.JWTUtils;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {
    @Autowired
    private AuthManagementService usersManagementService;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private MailService mailService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private JWTUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<AuthDTO> regeister(@RequestBody AuthDTO reg) {
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDTO> login(@RequestBody AuthDTO req) {
        AuthDTO response = usersManagementService.login(req);

        // Trả về mã trạng thái phù hợp dựa vào statusCode
        if (response.getStatusCode() == 200) {
            return ResponseEntity.ok(response);
        } else if (response.getStatusCode() == 401) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } else if (response.getStatusCode() == 404) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<AuthDTO> refreshToken(@RequestBody AuthDTO req) {
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<AuthDTO> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<AuthDTO> getUSerByID(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<AuthDTO> updateUser(@PathVariable Integer userId, @RequestBody User reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @PostMapping("/login-social")
    public ResponseEntity<AuthDTO> createUser(@RequestBody User newUser) {
        return ResponseEntity.ok(usersManagementService.loginSocial(newUser));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<AuthDTO> getMyProfile(HttpServletRequest request) {
        // Lấy thông tin xác thực từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            System.out.println("Đã NULL");
        }
        String email = authentication.getName();
        AuthDTO response = usersManagementService.getMyInfo(email);

        // Trả về phản hồi với mã trạng thái và nội dung
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<AuthDTO> deleteUSer(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendResetPasswordEmail(@RequestBody EmailRequestDTO emailRequest) {
        String email = emailRequest.getTo();
        Optional<User> userOptional = usersRepo.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String jwt = jwtUtils.generateToken(user);
            user.setResetToken(jwt);
            user.setTokenExpiryDate(LocalDateTime.now().plusHours(24)); // Token hết hạn sau 24 giờ
            usersRepo.save(user);

            // Tạo link reset password
            String resetLink = "http://localhost:3000/auth/reset-password?token=" + jwt;

            // Gửi email
            mailService.sendEmail(email, "Reset Password", "Click the link to reset your password: " + resetLink);

            return ResponseEntity.ok("Reset password email sent successfully");
        } else {
            return ResponseEntity.status(404).body("Email not found");
        }
    }

    // @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        // Kiểm tra token có được cung cấp không
        if (token == null) {
            return ResponseEntity.status(400).body("Token is required");
        }

        // Xác thực token
        String username = jwtUtils.extractUsername(token);
        if (username == null || !jwtUtils.isTokenValid(token,
                new org.springframework.security.core.userdetails.User(username, "", new ArrayList<>()))) {
            return ResponseEntity.status(400).body("Invalid or expired token");
        }

        // Kiểm tra người dùng có tồn tại không
        Optional<User> userOptional = usersRepo.findByEmail(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            usersRepo.save(user);
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

}
