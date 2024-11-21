'use client'

import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"
import { messageSchema } from "@/Schemas/messageSchema";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";


export default function page() {

    const [isSending, setIsSending] = useState(false);
    const params = useParams<{ username: string }>();
    const userName = params.username;
    const { toast } = useToast();

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema)
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true);

        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                ...data,
                username: userName
            });

            toast({
                title: response.data.success ? "Success" : "Failed",
                description: response.data.message,
            });

            form.reset({ ...form.getValues(), content: '' });

        } catch (error) {
            console.error("Error in User Sending Message", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? 'Error in Sending Message';
            toast({
                title: "Failed",
                description: errorMessage,
                variant: "destructive"
            });

        } finally {
            setIsSending(false);
        }
    }


    return (
            <div className="container mx-auto my-8 rounded bg-white max-w-4xl p-6">
                <h1 className="mb-6 text-center text-3xl sm:text-5xl lg:text-7xl font-bold">Public Profile Link</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold">Send Anonymous Message to @{userName}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type your message here." className="resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                        <Button type="submit" disabled={isSending}>
                            {
                                isSending ?
                                    (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait
                                        </>
                                    ) :
                                    ('Send It')
                            }
                        </Button>
                        </div>
                    </form>
                </Form>
            <div className="my-6">
                <Button>Suggest Messages</Button>
                    <p className="text-muted-foreground font-semibold my-6">Click on any Message to below to select it</p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Messages</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            <Button
                                variant="outline"
                                className="mb-2"
                            >
                                Message Here
                            </Button>
                            <Button
                                variant="outline"
                                className="mb-2"
                            >
                                Message Here
                            </Button>
                            <Button
                                variant="outline"
                                className="mb-2"
                            >
                                Message Here
                            </Button>
                        </CardContent>
                    </Card>
                    <Separator className="mt-7" />
                    <div className="m-y-4 flex justify-center flex-col items-center gap-4 mt-5">
                        <p>Get Your Message Board</p>
                        <Link href={'/sign-in'}>
                            <Button>Create Your Account</Button>
                        </Link>
                    </div>
                </div>
            </div>
    )
}