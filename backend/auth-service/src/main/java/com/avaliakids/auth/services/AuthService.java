package com.avaliakids.auth.services;

import com.avaliakids.auth.exceptions.InvalidRoleException;
import com.avaliakids.auth.exceptions.UserAlreadyExistsException;
import com.avaliakids.auth.models.User;
import com.avaliakids.auth.repositories.UserRepository;
import com.avaliakids.auth.utils.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

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

    /**
     * 🔹 Valida a senha do responsável (PARENT)
     * @param parentId - ID do usuário responsável
     * @param password - Senha digitada pelo responsável
     * @return true se a senha estiver correta, false caso contrário
     */
    public boolean validateParentPassword(String parentId, String password) {
        Optional<User> userOpt = userRepository.findById(parentId);
        if (userOpt.isEmpty()) {
            return false; // Usuário não encontrado
        }

        User user = userOpt.get();
        return passwordEncoder.matches(password, user.getPassword()); // Verifica se a senha está correta
    }
}
