import { Logo } from "@/components/icons/logo";
import { Paths } from "@/lib/constants";

interface InviteEmailTemplateProps {
  organizationName: string;
  token: string;
}

export function InviteEmailTemplate({ organizationName, token }: InviteEmailTemplateProps) {
  const date = new Date();
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Logo size={32} />
      </div>
      <h2 style={{ color: "#333" }}>You are invited to join {organizationName}</h2>
      <a
        href={Paths.invite(token)}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#3b82f6",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Accept Invitation
      </a>
      <p>If you did not expect this email, you can safely ignore it.</p>
      <div>&copy; {date.getFullYear()} Tdata. All rights reserved.</div>
    </div>
  );
}
