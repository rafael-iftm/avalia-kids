package com.avaliakids.auth.dtos;

public class LoginRequest {
    private String email;
    private String password;

    // Construtor vazio (obrigatório para desserialização)
    public LoginRequest() {}

    // Getters e setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
