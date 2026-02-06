package mmu.sef.fyj.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class EnvironmentConfiguration {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        
        // Set specific environment variables from .env file as system properties
        String gmailUsername = dotenv.get("GMAIL_USERNAME");
        String gmailPassword = dotenv.get("GMAIL_PASSWORD");
        
        if (gmailUsername != null) {
            System.setProperty("GMAIL_USERNAME", gmailUsername);
        }
        if (gmailPassword != null) {
            System.setProperty("GMAIL_PASSWORD", gmailPassword);
        }
    }
}
