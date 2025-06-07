package com.avaliakids.auth.services;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    public void sendResetPasswordEmail(String toEmail, String resetLink) throws IOException {
        Email from = new Email(fromEmail, "Avalia Kids");
        Email to = new Email(toEmail);
        String subject = "Recuperação de Senha - Avalia Kids";

        String htmlContent = "<strong>Olá!</strong><br><br>"
                + "Clique no link abaixo para redefinir sua senha:<br>"
                + "<a href=\"" + resetLink + "\">Redefinir Senha</a><br><br>"
                + "Se você não solicitou isso, ignore este e-mail.";

        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        Response response = sg.api(request);

        System.out.println("📬 Status: " + response.getStatusCode());
        System.out.println("📬 Corpo: " + response.getBody());
    }
}
