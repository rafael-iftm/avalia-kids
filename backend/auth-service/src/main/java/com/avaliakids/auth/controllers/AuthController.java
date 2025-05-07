package com.avaliakids.auth.controllers;

import com.avaliakids.auth.exceptions.InvalidRoleException;
import com.avaliakids.auth.exceptions.UserAlreadyExistsException;
import com.avaliakids.auth.models.User;
import com.avaliakids.auth.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            authService.registerUser(user.getName(), user.getEmail(), user.getPassword(), user.getRole());
            return ResponseEntity.ok(Map.of("message", "Usuário registrado com sucesso."));
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (InvalidRoleException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Erro no servidor."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Optional<User> authenticatedUser = authService.authenticateUser(email, password);
        if (authenticatedUser.isPresent()) {
            User user = authenticatedUser.get();
            String token = authService.generateToken(user.getEmail(), user.getRole());
    
            return ResponseEntity.ok(Map.of(
                "token", token,
                "userId", user.getId(),
                "name", user.getName(),
                "role", user.getRole()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciais inválidas."));
        }
    }    

    @PostMapping("/validate-password")
    public ResponseEntity<?> validateParentPassword(@RequestBody Map<String, String> requestBody) {
        String parentId = requestBody.get("parentId");
        String password = requestBody.get("password");

        boolean isValid = authService.validateParentPassword(parentId, password);
        if (!isValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Senha incorreta."));
        }

        return ResponseEntity.ok(Map.of("isValid", true));
    }
}