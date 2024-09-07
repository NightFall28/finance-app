import { SignIn, ClerkLoading, ClerkLoaded } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
        <div className='h-full lg:flex flex-col items-center justify-center px-4'>
            <div className='text-center space-y-4 pt-6'>
                <h1 className='text-4xl font-extrabold'> 
                    Welcome Back!
                </h1>
                <p className='text-gray-600'>
                    Sign in to your account to get back to your dashboard!
                </p>
            </div>

            <div className='flex items-center justify-center mt-6'>
                <ClerkLoaded>
                    <SignIn path='/sign-in'/>
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className='animate-spin text-muted-foreground' />
                </ClerkLoading>
            </div>
        </div>

        <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
            <Image src="/logoipsum.svg" height={100} width={100} alt='Logo'/>
        </div>
    </div>
);
}