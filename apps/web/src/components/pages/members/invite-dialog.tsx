"use client";

import type React from "react";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, User } from "lucide-react";
import { useOrganizations, useUser } from "@/hooks";
import { toast } from "sonner";
import { Role } from "@tdata/shared/types";
import { createInvitation } from "@/lib/actions/organization";

const checkEmailValidity = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function InviteMemberDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!email || !checkEmailValidity(email)) return;
    e.preventDefault();

    setIsSubmitting(true);

    const { success } = await createInvitation({ email, invitedById: user.id, organizationId: organization.id, role: "Member" });

    if (success) {
      toast.success("Invitation Successful");
    } else {
      toast.error("An error occured while inviting.");
    }

    // Reset form and close dialog
    setIsSubmitting(false);
    setRole("Member");
    setOpen(false);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const isEmailValid = checkEmailValidity(email);
    setIsEmailValid(isEmailValid);
    setEmail(email);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription className="text-muted-foreground">Send invitations to your team members to join your workspace.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emails" className="text-muted-foreground">
                Email addresses
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="emails" placeholder="Enter email address" className="pl-8" value={email} onChange={handleEmailChange} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-muted-foreground">
                Role
              </Label>
              <Select value={role} onValueChange={(role: string) => setRole(role as Role)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="Member">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      Member
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isEmailValid || isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invites
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
