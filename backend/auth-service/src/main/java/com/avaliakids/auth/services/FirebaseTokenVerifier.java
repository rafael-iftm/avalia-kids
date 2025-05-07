package com.avaliakids.auth.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseTokenVerifier {

    public FirebaseToken verifyToken(String token) throws Exception {
        return FirebaseAuth.getInstance().verifyIdToken(token);
    }
}
