import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { Message } from '@/model/User';

export async function POST(request:Request){
    dbConnect();
    await dbConnect();
    const {username, content} = await request.json();
    

    try {
        
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status:404});
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages currently"
            },{status:403});
        }

        const newMessage = {content,createdAt: new Date()};

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success:true,
            message:"Message Sent Successfully"
        },{status:200});

    } catch (error) {
        console.error("Failed to Send User Message",error);
        return Response.json({
            success:false,
            message:"Failed to Send User Message"
        },{status:500});
    }
}

