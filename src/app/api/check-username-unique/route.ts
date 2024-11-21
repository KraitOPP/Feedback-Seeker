import { userNameValidation } from '@/Schemas/signUpSchema'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import {z} from 'zod'


const UsernameQuerySchema = z.object({
    username: userNameValidation
});

export async function GET(request: Request){

    await dbConnect();

    try {

        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length>0 ? usernameErrors.join(', ') : "Invalid Query Parameters" ,
            },{status:400})
        }

        const {username} = result.data;
        const existingUserVerifiedByUserName = await UserModel.findOne({username, isVerified: true});

        if(existingUserVerifiedByUserName){
            return Response.json({
                success:false,
                message:"Username Already Taken"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Username is Unique"
        },{status:400})

    } catch (error) {
        console.error("Error Checking Username",error);

        return Response.json({
            success:false,
            message:"Error Checking Username"
        },{status:500})
    }
}