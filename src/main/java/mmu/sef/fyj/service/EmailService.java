package mmu.sef.fyj.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.from-name}")
    private String fromName;

    /**
     * Send application approval email to student
     */
    public void sendApprovalEmail(String studentEmail, String studentName, String scholarshipName) {
        try {
            logger.debug("Attempting to send approval email to: {} from: {}", studentEmail, fromEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(studentEmail);
            helper.setSubject("Your Scholarship Application Has Been APPROVED! ✓");

            String htmlContent = buildApprovalEmailContent(studentName, scholarshipName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("✓ Approval email sent successfully to: {}", studentEmail);
        } catch (MessagingException e) {
            logger.error("✗ MessagingException - Failed to send approval email to: {} - {}", studentEmail, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("✗ Unexpected error while sending approval email to: {} - {}", studentEmail, e.getMessage(), e);
        }
    }

    /**
     * Send application rejection email to student
     */
    public void sendRejectionEmail(String studentEmail, String studentName, String scholarshipName) {
        try {
            logger.debug("Attempting to send rejection email to: {} from: {}", studentEmail, fromEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(studentEmail);
            helper.setSubject("Update on Your Scholarship Application");

            String htmlContent = buildRejectionEmailContent(studentName, scholarshipName);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("✓ Rejection email sent successfully to: {}", studentEmail);
        } catch (MessagingException e) {
            logger.error("✗ MessagingException - Failed to send rejection email to: {} - {}", studentEmail, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("✗ Unexpected error while sending rejection email to: {} - {}", studentEmail, e.getMessage(), e);
        }
    }

    /**
     * Build HTML content for approval email
     */
    private String buildApprovalEmailContent(String studentName, String scholarshipName) {
        String htmlTemplate = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
                        .success-message { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #28a745; }
                        .scholarship-info { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196F3; }
                        .next-steps { margin: 20px 0; }
                        .next-steps h3 { color: #667eea; margin-top: 0; }
                        .next-steps ul { padding-left: 20px; }
                        .next-steps li { margin: 10px 0; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
                        .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Congratulations!</h1>
                        </div>
                        <div class="content">
                            <p>Dear <strong>STUDENT_NAME</strong>,</p>
                            
                            <div class="success-message">
                                <strong>Great news!</strong> Your application for the <strong>SCHOLARSHIP_NAME</strong> scholarship has been <strong>APPROVED</strong>!
                            </div>
                            
                            <p>We are pleased to inform you that your scholarship application has met all the required criteria and has been approved by our selection committee.</p>
                            
                            <div class="scholarship-info">
                                <strong>Scholarship Details:</strong><br>
                                Scholarship Name: SCHOLARSHIP_NAME
                            </div>
                            
                            <div class="next-steps">
                                <h3>Next Steps:</h3>
                                <ul>
                                    <li>Check your scholarship account dashboard for more details</li>
                                    <li>Review the scholarship terms and conditions</li>
                                    <li>Complete any required documentation</li>
                                    <li>Wait for further communication regarding disbursement</li>
                                </ul>
                            </div>
                            
                            <p>If you have any questions or concerns, please don't hesitate to contact our scholarship office.</p>
                            
                            <p>Best regards,<br>
                            <strong>Scholarship Management System</strong></p>
                            
                            <div class="footer">
                                <p>This is an automated email. Please do not reply directly to this message.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """;
        
        return htmlTemplate
            .replace("STUDENT_NAME", studentName)
            .replace("SCHOLARSHIP_NAME", scholarshipName);
    }

    /**
     * Build HTML content for rejection email
     */
    private String buildRejectionEmailContent(String studentName, String scholarshipName) {
        String htmlTemplate = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; }
                        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; }
                        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
                        .message { background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ffc107; }
                        .scholarship-info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #999; }
                        .encouragement { background-color: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Application Status Update</h1>
                        </div>
                        <div class="content">
                            <p>Dear <strong>STUDENT_NAME</strong>,</p>
                            
                            <div class="message">
                                <strong>Update on Your Application:</strong> Thank you for applying for the <strong>SCHOLARSHIP_NAME</strong> scholarship. After careful review by our selection committee, we regret to inform you that your application was not selected at this time.
                            </div>
                            
                            <p>We received a significant number of qualified applications, and our selection committee had to make difficult decisions based on the scholarship's criteria and available funding.</p>
                            
                            <div class="scholarship-info">
                                <strong>Application Details:</strong><br>
                                Scholarship Name: SCHOLARSHIP_NAME<br>
                                Status: <strong style="color: #d32f2f;">Not Selected</strong>
                            </div>
                            
                            <div class="encouragement">
                                <strong>Don't Give Up!</strong><br>
                                There are more scholarships available. We encourage you to explore other scholarship opportunities that may be a better fit for your profile. Feel free to apply for other scholarships in future cycles.
                            </div>
                            
                            <p>If you would like feedback on your application or have any questions, please contact our scholarship office.</p>
                            
                            <p>Best regards,<br>
                            <strong>Scholarship Management System</strong></p>
                            
                            <div class="footer">
                                <p>This is an automated email. Please do not reply directly to this message.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
                """;
        
        return htmlTemplate
            .replace("STUDENT_NAME", studentName)
            .replace("SCHOLARSHIP_NAME", scholarshipName);
    }
}
