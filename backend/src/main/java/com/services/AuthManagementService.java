package com.services;

import com.models.AuthDTO;
import com.models.EmailRequestDTO;
import com.entities.User;
import com.entities.Cart;
import com.entities.Role;
import com.entities.UserRole;
import com.repositories.RoleRepo;
import com.repositories.UsersRepo;
import com.utils.DateTimeUtil;
import com.utils.JWTUtils;
import com.repositories.UserRoleRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthManagementService {

    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private UserRoleRepo userRoleRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MailService mailService;

    Date datecurrent = DateTimeUtil.getCurrentDateInVietnam();

    @Autowired
    private CartService cartRepo;

    public AuthDTO register(AuthDTO registrationRequest) {
        AuthDTO resp = new AuthDTO();

        // Định nghĩa regex cho email, password, và số điện thoại
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        String phoneRegex = "^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$";
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        String nameRegex = "^([A-ZÀ-Ỹ][a-zà-ỹ]*(\\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*)$";

        try {
            String username = registrationRequest.getUsername();

            // Kiểm tra và xác định đầu vào có phải là email hay số điện thoại
            if (username == null || username.isEmpty()) {
                throw new IllegalArgumentException("Username cannot be empty");
            }

            if (username.matches(emailRegex)) {
                // Trường hợp username là email
                Optional<User> existingUser = usersRepo.findByEmailAndProvider(username, "Guest");
                if (existingUser.isPresent()) {
                    throw new IllegalArgumentException("Email already exists with provider Guest");
                }
            } else if (username.matches(phoneRegex)) {
                // Trường hợp username là số điện thoại
                Optional<User> existingUser = usersRepo.findByPhoneAndProvider(username, "Guest");
                if (existingUser.isPresent()) {
                    throw new IllegalArgumentException("Phone number already exists with provider Guest");
                }
            } else {
                // Trường hợp không phải là email hoặc số điện thoại
                throw new IllegalArgumentException("Invalid username format. Must be a valid email or phone number");
            }

            // Validate password
            if (registrationRequest.getPassword() == null || registrationRequest.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Invalid password is empty");
            }
            if (!registrationRequest.getPassword().matches(passwordRegex)) {
                throw new IllegalArgumentException(
                        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character");
            }

            // Validate full name
            if (registrationRequest.getFullName() == null || registrationRequest.getFullName().isEmpty()) {
                throw new IllegalArgumentException("Invalid full name is empty");
            }
            if (!registrationRequest.getFullName().matches(nameRegex)) {
                throw new IllegalArgumentException("Full name cannot contain special characters or numbers");
            }

            // Tạo người dùng mới
            User ourUser = new User();
            ourUser.setEmail(username.matches(emailRegex) ? username : null);
            ourUser.setPhone(username.matches(phoneRegex) ? username : null);
            ourUser.setFullName(registrationRequest.getFullName());
            ourUser.setUsername(username);
            ourUser.setCreateDate(datecurrent);
            ourUser.setProvider("Guest");
            ourUser.setStatus((byte) (registrationRequest.getIsActive()));
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            User ourUsersResult = usersRepo.save(ourUser);

            // Gán quyền cho người dùng
            List<String> roles = Collections.singletonList("User");
            List<UserRole> userRoles = roles.stream().map(roleName -> {
                Role role = roleRepo.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                UserRole userRole = new UserRole();
                userRole.setUser(ourUsersResult);
                userRole.setRole(role);
                return userRole;
            }).collect(Collectors.toList());

            userRoleRepo.saveAll(userRoles);

            Cart newCart = new Cart();
            newCart.setUser(ourUsersResult);
            cartRepo.addCart(newCart);

            if (ourUsersResult.getUserId() > 0) {
                resp.setListData(ourUsersResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
            }

        } catch (IllegalArgumentException e) {
            resp.setStatusCode(400);
            resp.setError(e.getMessage());
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError("Error occurred while registering user: " + e.getMessage());
        }
        return resp;
    }

    public ResponseEntity<AuthDTO> login(AuthDTO loginRequest) {
        AuthDTO response = new AuthDTO();
        try {
            // Tìm kiếm người dùng dựa trên email và provider
            Optional<User> optionalUser = usersRepo.findByEmailAndProvider(loginRequest.getUsername(), "Guest");

            if (optionalUser.isEmpty()) {
                response.setStatusCode(401);
                response.setError("Login fail: username or password incorrect");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            User user = optionalUser.get();

            // Xác thực người dùng
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            // Tạo token và refresh token
            String jwt = jwtUtils.generateToken(user);
            String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Cập nhật thông tin người dùng vào phản hồi
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setFullName(user.getFullName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            // response.setIsActive(user.getStatus());
            response.setRoles(user.getUserRoles().stream()
                    .map(UserRole::getRole)
                    .map(Role::getRoleName)
                    .collect(Collectors.toList()));

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            response.setStatusCode(401);
            response.setError("Login fail");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (AuthenticationException e) {
            response.setStatusCode(401);
            response.setError("Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            System.out.println("Username: " + loginRequest.getUsername());
            System.out.println("An error occurred: " + e.getMessage());
            e.printStackTrace();
            response.setStatusCode(500);
            response.setError("An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public AuthDTO refreshToken(AuthDTO refreshTokenReqiest) {
        AuthDTO response = new AuthDTO();
        try {
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            User users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    public AuthDTO getAllUsers() {
        AuthDTO reqRes = new AuthDTO();

        try {
            List<User> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setUserList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }

    public AuthDTO getUsersById(Integer id) {
        AuthDTO reqRes = new AuthDTO();
        try {
            User usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setListData(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

    public AuthDTO deleteUser(Integer userId) {
        AuthDTO reqRes = new AuthDTO();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public AuthDTO updateUser(Integer userId, User updatedUser) {
        AuthDTO reqRes = new AuthDTO();
        try {
            Optional<User> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();
                // existingUser.setEmail(updatedUser.getEmail());
                // existingUser.setFullName(updatedUser.getFullName());
                // existingUser.setUsername(updatedUser.getEmail());
                // existingUser.setPhone(updatedUser.getPhone());
                // existingUser.setImage(updatedUser.getImage());
                // existingUser.setStatus(updatedUser.getStatus());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                User savedUser = usersRepo.save(existingUser);
                reqRes.setListData(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }

    public AuthDTO loginSocial(User newUser) {
        AuthDTO reqRes = new AuthDTO();
        try {
            // Kiểm tra xem user có tồn tại trong cơ sở dữ liệu không
            if (usersRepo.findByUsername(newUser.getUsername()).isPresent()
                    && newUser.getProvider().equalsIgnoreCase("facebook")) {
                reqRes.setStatusCode(200);
                reqRes.setMessage("Login Facebook successfully");
                return reqRes;
            }
            if (usersRepo.findByUsername(newUser.getUsername()).isPresent()
                    && newUser.getProvider().equalsIgnoreCase("google")) {
                reqRes.setStatusCode(200);
                reqRes.setMessage("Login Google successfully");
                return reqRes;
            }
            newUser.setStatus((byte) 1);
            newUser.setCreateDate(datecurrent);
            // Lưu người dùng mới vào cơ sở dữ liệu
            User savedUser = usersRepo.save(newUser);

            List<String> roles = Collections.singletonList("User");

            List<UserRole> userRoles = roles.stream().map(roleName -> {
                Role role = roleRepo.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                UserRole userRole = new UserRole();
                userRole.setUser(newUser);
                userRole.setRole(role);
                return userRole;
            }).collect(Collectors.toList());

            userRoleRepo.saveAll(userRoles);

            // Tạo phản hồi thành công
            reqRes.setListData(savedUser);
            reqRes.setStatusCode(201); // Mã trạng thái HTTP 201 cho việc tạo thành công
            reqRes.setMessage("User created successfully");

        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while creating user: " + e.getMessage());
        }
        return reqRes;
    }

    public AuthDTO getMyInfo(String email) {
        AuthDTO reqRes = new AuthDTO();
        try {
            Optional<User> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                System.out.println(userOptional.get().getEmail());
            } else {
                System.out.println("Không tìm thấy email: " + email);
            }
            if (userOptional.isPresent()) {
                reqRes.setListData(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Fail");

            }

        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }

    public ResponseEntity<String> sendResetPasswordEmail(EmailRequestDTO emailRequest) {
        String email = emailRequest.getTo();
        Optional<User> userOptional = usersRepo.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            String jwt = jwtUtils.generateToken(user);
            user.setResetToken(jwt);

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

    public ResponseEntity<String> resetPassword(Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

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
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Kiểm tra mật khẩu mới có được cung cấp không
        if (newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.status(400).body("New password is required");
        }

        // Kiểm tra định dạng mật khẩu mới
        if (!newPassword.matches(passwordRegex)) {
            return ResponseEntity.status(400).body(
                    "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character");
        }

        // Cập nhật mật khẩu mới cho người dùng
        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepo.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }

}
