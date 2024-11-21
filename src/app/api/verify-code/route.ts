import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'

export async function POST(request: Request){
    await dbConnect();

    try {
        
        const {username,code} = await request.json();

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodedUsername});

        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status:400})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"Account Verified Successfully"
            },{status:200})
        }

        if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification Code has Expired, Please Signup again to get a new code"
            },{status:400});
        }

        return Response.json({
            success:false,
            message:"Incorrect Verification Code"
        },{status:400})

    } catch (error) {
        console.error("Error Verifying User",error);

        return Response.json({
            success:false,
            message:"Error Verifying User"
        },{status:500})
    }
}