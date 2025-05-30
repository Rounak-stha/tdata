"use client";

import type { FC } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { CheckCircle, ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CatchPhrase, Paths } from "@/lib/constants";
import { Logo } from "@/components/icons/logo";
import { InfantUser, InvitationDetail } from "@tdata/shared/types";
import { acceptInvitation, signInWithEmail } from "@/lib/actions/auth";
import { toast } from "sonner";

interface InvitePageProps {
  user: InfantUser | null;
  invitation: InvitationDetail;
}

export const InvitePage: FC<InvitePageProps> = ({ invitation, user }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      if (!user) {
        const { success } = await signInWithEmail(invitation.email);
        if (success) {
          router.push(Paths.verifyEmail({ email: invitation.email, token: invitation.token }));
        } else throw success;
      } else {
        const result = await acceptInvitation(invitation.token);
        if (result.success) router.push(Paths.root());
        else toast.error(result.message);
      }
    } catch {
      toast.error("Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  // 1. Get org info from token
  // 2. Navigate to onboarding with this token

  // 3. Check if user is logged in (check session)
  // 3.1. If logged in check logged in user email matches with the invitee email
  // 3.1.1. If not show error
  // 3.2. When user accepts invite, update org info in session -> navigate to org page

  // 4. If user is not logged in
  // .1. If user accepts the invite -> send otp to email
  // 4.2. Navigate to OTP verification page (OTP signup process) along with a query param with the token

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo size={100} />
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Tdata</h1>
          <p className="text-muted-foreground0">{CatchPhrase}</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl text-center">You&apos;ve been invited!</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              You&apos;ve been invited to join the &quot;{invitation.organization.name}&quot; organization
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                Email address
              </Label>
              <Input id="email" type="email" placeholder="your@email.com" defaultValue={invitation.email} disabled />
              <p className="text-xs text-gray-500">This is the email address the invite was sent to</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button className="w-full" disabled={loading} onClick={handleAcceptInvitation}>
              Accept Invitation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-xs text-center text-gray-500">
              By accepting this invitation, you agree to the
              <Link href="#" className="text-blue-500 hover:text-blue-400 mx-1">
                Terms of Service
              </Link>
              and
              <Link href="#" className="text-blue-500 hover:text-blue-400 ml-1">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost">
            <X className="mr-2 h-4 w-4" />
            Decline Invitation
          </Button>
        </div>
      </div>
    </div>
  );
};
