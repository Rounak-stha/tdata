import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrganizationUnAcceptedInvitations } from "@/lib/server";
import { Organization } from "@tdata/shared/types";
import { Clock, MoreHorizontal, Shield, User } from "lucide-react";

interface InvitationListProps {
  organization: Organization;
}

export async function InvitationList({ organization }: InvitationListProps) {
  const invitations = await getOrganizationUnAcceptedInvitations(organization.id);
  const currentDate = new Date();

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-muted/20 border">
              <TableHead className="text-muted-foreground w-[300px]">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Invited By</TableHead>
              <TableHead className="text-muted-foreground">Invited At</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length > 0 ? (
              invitations.map((invite) => {
                const status = invite.expiresAt < currentDate ? "Expired" : "Pending";
                return (
                  <TableRow key={invite.id} className="hover:bg-muted/20 border">
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invite.role === "Admin" ? "default" : "secondary"}
                        className={`
                        ${invite.role === "Admin" ? "bg-primary text-white" : ""}
                        ${invite.role === "Member" ? "bg-[#333] text-muted-foreground" : ""}
                      `}
                      >
                        {invite.role === "Admin" ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                        {invite.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === "Pending" ? "default" : "secondary"}
                        className={`
                        ${status === "Pending" ? "bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/20" : ""}
                        ${status === "Expired" ? "bg-gray-600/20 text-muted-foreground hover:bg-gray-600/20" : ""}
                      `}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{invite.invitedby.name}</TableCell>
                    <TableCell className="text-muted-foreground">{invite.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger disabled asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive hover:bg-muted hover:text-destructive/80 cursor-pointer">Cancel Invite</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No invitations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
