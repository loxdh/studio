'use client';
import { useUser } from '@/firebase';
import { useAuth, useFirestore } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async () => {
    if (!auth || !firestore) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the useEffect handle redirection
    } catch (error: any) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential'
      ) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const newUser = userCredential.user;
          
          // Assign admin role to the new user
          const adminRoleRef = doc(firestore, 'roles_admin', newUser.uid);
          await setDoc(adminRoleRef, { isAdmin: true });

          toast({
            title: 'Admin Account Created',
            description:
              'A new admin account has been created. You are now signed in.',
          });
          // Let the useEffect handle redirection
        } catch (signUpError: any) {
          toast({
            variant: 'destructive',
            title: 'Sign-up failed',
            description: signUpError.message,
          });
        }
      } else if (error.code === 'auth/wrong-password') {
        toast({
          variant: 'destructive',
          title: 'Sign-in failed',
          description: 'Incorrect password. Please try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign-in failed',
          description: error.message,
        });
      }
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your email and password to access the admin dashboard. If the
            account does not exist, it will be created as an admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
