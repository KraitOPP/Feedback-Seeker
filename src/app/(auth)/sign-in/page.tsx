'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/Schemas/signInSchema';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { signIn } from "next-auth/react";

export default function Page() {
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsProcessing(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        console.error("Error result:", result);
        toast({
          title: "Login Failed",
          description: result.error === 'CredentialsSignin' ? "Incorrect Username or Password" : result.error,
          variant: 'destructive',
        });
      }
      
      if (result?.url !== null) {
        toast({
          title: "Login Successfull",
          description: `Welcome ${data.identifier} to Feedback Seeker`
        });
        router.replace("/dashboard");
      }

    } catch (error) {
      console.error("Error Sign In User", error);
      toast({
        title: "Login Failed",
        description: "Server Issue, Please Try Again!",
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Welcome Back to Secret Message</h1>
          <p className='mb-4'>Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className='text-center mt-4'>
          <p>New User? {' '}
            <Link href={'/sign-up'} className='text-blue-600 hover:text-blue-800'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
