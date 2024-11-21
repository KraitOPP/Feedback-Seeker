import {getServerSession} from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function POST(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        );

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to Update User Status to accept Messages"
            },{status:401});
        }

        return Response.json({
            success:true,
            message:"Message Acceptance Status Updated Successfully",
            updatedUser
        },{status:201});

    } catch (error) {
        console.error("Failed to Update User Status to accept Messages",error);
        return Response.json({
            success:false,
            message:"Failed to Update User Status to accept Messages"
        },{status:500});
    }

}

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401});
    }

    const userId = user._id;
    
    try {
        const founduser = await UserModel.findById(userId);
        if(!founduser){
            return Response.json({
                success:false,
                message:"User Not Found"
            },{status:404});
        }

        return Response.json({
            success:true,
            isAcceptingMessages: founduser.isAcceptingMessage
        },{status:200});


    } catch (error) {
        console.error("Failed to Get User Status to accept Messages",error);
        return Response.json({
            success:false,
            message:"Failed to Get User Status to accept Messages"
        },{status:500});
    }
}