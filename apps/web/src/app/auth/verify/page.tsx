"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import TDataLogo from '@/components/TDataLogo'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP } from "@components/ui/input-otp";
import { Paths } from "@/lib/constants";
import { toast } from "sonner";
import { acceptInvitation, verifyOtp } from "@/lib/actions/auth";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchParams = new URLSearchParams(window?.location?.search);
    const email = searchParams.get("email");

    if (email) {
      setEmail(decodeURIComponent(email));
    } else {
      router.push(Paths.signin);
    }
  }, [router]);

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (otp.length !== 6) {
        throw new Error("Please enter all 6 digits");
      }
      const { success } = await verifyOtp(email, otp);
      if (!success) toast.error("Invalid OTP");
      else {
        const token = searchParams.get("token");
        let path = "";
        if (token) {
          const { success } = await acceptInvitation(token);
          if (success) path = Paths.root({ token });
          else throw new Error("Failed to accept invitation");
        } else {
          path = Paths.root();
        }
        router.push(path);
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Simulating resend code
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("New code sent!");
  };

  return (
    <div className="dark min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">{/* <TDataLogo className="w-20 h-20" /> */}</div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Verify OTP</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter the 6-digit code sent to your email. This code is valid for the next 10 minutes.</p>

        <div className="mt-8 bg-card rounded-lg p-8">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">
                One-Time Password
              </Label>
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={setOtp} length={6} id="otp" name="otp" autoComplete="one-time-code" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
              {loading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <button type="button" onClick={handleResendCode} className="text-sm text-primary hover:text-primary/90 transition-colors">
                Didn&apos;t get the code? Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
