package com.examly.springapp.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordValidator {

    private static final String PASSWORD_PATTERN = 
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public boolean isValid(String password) {
        return pattern.matcher(password).matches();
    }

    public String getPasswordRequirements() {
        return "Password must be at least 8 characters long and contain at least one digit, " +
               "one lowercase letter, one uppercase letter, and one special character (@#$%^&+=)";
    }
}