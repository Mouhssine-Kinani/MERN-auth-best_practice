import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Verification email sent successfully : ", response);
  } catch (error) {
    console.error("Error sending verification email : ", error);
    throw new Error(`Failed to send verification email : ${error.message}`);
  }
};

export const sendWelcomeEmail = async (email, username) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "4ea1af68-1455-4375-a226-5d1394de83dd",
      template_variables: {
        company_info_name: "the Mkinani company",
        name: username,
      }
    });
    console.log("Welcome email sent successfully : ", response);
  } catch (error) {
    console.error("Error sending welcome email : ", error);
    throw new Error(`Failed to send welcome email : ${error.message}`);
  }
};

export const sendPasswordResetEmail = async(email, resetUrl) => {
    const recipien =  [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipien,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        })
    } catch (error) {
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
    
}

export const sendResetSuccessEmail = async (email) =>{
    const recipient = [{email}];
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Password Reset Success"
      })
    } catch (error) {
      throw new Error(`Failed to send password reset success email: ${error.message}`);
    }
}