"use server";

import { Resend } from "resend";
import { InviteEmailTemplate } from "@/email/invite-email";

const resend = new Resend(process.env.RESEND_API_KEY);

type ReturnType<T> = { success: true; data: T } | { success: false; data: null };

export const sendInviteEmail = async (email: string, organizationName: string, token: string): Promise<ReturnType<{ message: string }>> => {
  try {
    const { error } = await resend.emails.send({
      from: "Tdata Invitation <invitation@tdata.app>",
      to: email,
      subject: `Invitation to join ${organizationName} on Tdata`,
      react: InviteEmailTemplate({ organizationName, token }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data: { message: "Invitation email sent successfully" } };
  } catch (error) {
    console.error(error);
    return { success: false, data: null };
  }
};
