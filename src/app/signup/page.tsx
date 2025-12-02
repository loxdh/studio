'use client';

import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import Aurora from '@/components/ui/aurora';
import FadeIn from '@/components/ui/fade-in';

export default function SignUpPage() {
    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth) return;

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });

            toast({
                title: 'Account Created',
                description: 'Welcome to United Love Luxe!',
            });
            router.push('/account');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Sign-up failed',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Aurora
                    colorStops={['#FFD700', '#DAA520', '#B8860B']}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            </div>

            <FadeIn className="relative z-10 w-full max-w-md px-4">
                <Card className="w-full bg-background/95 backdrop-blur shadow-xl border-muted">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-headline text-center">Create an Account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignUp} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </FadeIn>
        </div>
    );
}
