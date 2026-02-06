package mmu.sef.fyj;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.MapPropertySource;

@SpringBootApplication
public class FyjApplication {

	public static void main(String[] args) {
		// Load .env file BEFORE Spring initializes
		Dotenv dotenv = Dotenv.configure()
				.ignoreIfMissing()
				.load();
		
		// Create a property source from .env and add it early
		java.util.Map<String, Object> envProps = new java.util.HashMap<>();
		String gmailUsername = dotenv.get("GMAIL_USERNAME");
		String gmailPassword = dotenv.get("GMAIL_PASSWORD");
		
		if (gmailUsername != null) {
			envProps.put("GMAIL_USERNAME", gmailUsername);
			System.setProperty("GMAIL_USERNAME", gmailUsername);
		}
		if (gmailPassword != null) {
			envProps.put("GMAIL_PASSWORD", gmailPassword);
			System.setProperty("GMAIL_PASSWORD", gmailPassword);
		}
		
		SpringApplication app = new SpringApplication(FyjApplication.class);
		app.addInitializers(context -> 
			context.getEnvironment().getPropertySources()
				.addFirst(new MapPropertySource("dotenv", envProps))
		);
		app.run(args);
	}

}
