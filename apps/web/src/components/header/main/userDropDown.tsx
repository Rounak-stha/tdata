import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/auth";
import { signout } from "@/lib/actions/auth";
import { Paths } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const UserDropDown = () => {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
          <Avatar src={user.imageUrl} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Signout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Signout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setLoading(true);
      const { success } = await signout();
      if (!success) throw success;
      router.push(Paths.signin);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to log out`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem onClick={handleClick} disabled={loading}>
      Logout
    </DropdownMenuItem>
  );
};
