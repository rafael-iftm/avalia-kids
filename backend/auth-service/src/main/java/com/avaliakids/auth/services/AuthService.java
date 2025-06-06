package com.avaliakids.auth.services;

import com.avaliakids.auth.exceptions.InvalidRoleException;
import com.avaliakids.auth.exceptions.UserAlreadyExistsException;
import com.avaliakids.auth.models.User;
import com.avaliakids.auth.repositories.UserRepository;
import com.avaliakids.auth.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(String name, String email, String password, String role) {
        if (!(role.equalsIgnoreCase("PARENT") || role.equalsIgnoreCase("TEACHER"))) {
            throw new InvalidRoleException("O papel especificado é inválido. Deve ser PARENT ou TEACHER.");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("O e-mail fornecido já está registrado.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role.toUpperCase().trim());

        return userRepository.save(user);
    }

    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    public String generateToken(String email, String role) {
        return jwtUtil.generateToken(email, role); // Agora passamos a role corretamente
    }

    public boolean validateParentPassword(String parentId, String password) {
        Optional<User> userOpt = userRepository.findById(parentId);
        if (userOpt.isEmpty()) {
            return false; // Usuário não encontrado
        }

        User user = userOpt.get();
        return passwordEncoder.matches(password, user.getPassword()); // Verifica se a senha está correta
    }


    public void generateResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Tentativa de recuperação para e-mail inexistente: {}", email);
            return;
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        logger.info("🔐 Token de recuperação gerado para {}: {}", email, token);
        logger.info("🔗 Link simulado: http://localhost:5173/reset-password?token={}", token);
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findAll()
            .stream()
            .filter(user -> token.equals(user.getResetToken()))
            .findFirst();

        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);
        return true;
    }
}
