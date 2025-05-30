import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersList } from "./members-list";
import { InvitationList } from "./pending-invites-list";
import { InviteMemberDialog } from "./invite-dialog";
import { UserPlus, Users } from "lucide-react";
import { Organization } from "@tdata/shared/types";

interface MembersPageProps {
  organization: Organization;
}

export function MembersPage({ organization }: MembersPageProps) {
  return (
    <div className="mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Organization Members</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their roles</p>
        </div>

        {/* This button opens a modal dialog to invite new members when clicked */}
        <InviteMemberDialog>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </InviteMemberDialog>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 border">
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="pending">
            <UserPlus className="h-4 w-4 mr-2" />
            Pending Invites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-0">
          <MembersList organization={organization} />
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <InvitationList organization={organization} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
