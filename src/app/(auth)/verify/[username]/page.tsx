'use client'

import { verifySchema } from "@/Schemas/verifySchema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function verifyPage() {

    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code,
            });

            if (response.data.success) {
                toast({
                    title: "Verification Succesfull",
                    description: response.data.message,
                });
                router.replace('/sign-in')
            }
            else {
                toast({
                    title: "Failed",
                    description: response.data.message,
                    variant: "destructive"
                })
            }

        } catch (error) {
            console.error("Error in User SignUp", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'Error in Verifying User';
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            });
        }

    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='test-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Verification Code" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Verification Code Must be of length 6
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}