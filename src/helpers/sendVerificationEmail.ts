import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to:email.toLowerCase(),
            subject: 'Feedback Seeker | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
          });

        return {success:true, message:"Verification Email Send Successfully"};
    } catch (emailError) {
        console.error("Error Sending Verification Email",emailError)
        return {success:false, message:"Failed to Send Verification Email"}
    }
}