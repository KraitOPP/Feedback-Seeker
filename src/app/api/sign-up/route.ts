import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){

    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true
        });
        if(existingUserVerifiedByUserName){
            return Response.json({
                success:false,
                message:"User Name Already Exists",
            },{status:400});
        }
        
        const existingUserbyEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000+Math.random()*900000).toString()
        if(existingUserbyEmail){
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User Already Exists with this email",
                },{status:400});
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
                await existingUserbyEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = await new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                messages:[]
            });
            await newUser.save();
        }

        //send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            password,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },{status:500});
        }

        return Response.json({
            success:true,
            message:"User Registered Successfully, Please Verify your Email",
        },{status:201});

    } catch (error) {
        console.error("Failed to SignUp",error);
        return Response.json({
            success:false,
            message:"Error Registering User"
        },{
            status: 500
        })
    }
}