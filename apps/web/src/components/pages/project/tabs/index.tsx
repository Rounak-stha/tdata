import { FC, ReactNode } from "react";
import { BarChart3Icon, ListIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navigation = [
  { name: "Overview", icon: BarChart3Icon },
  { name: "Tasks", icon: ListIcon },
];

type ProjectTabProps = {
  children: ReactNode;
};

export const ProjectTab: FC<ProjectTabProps> = ({ children }) => {
  return (
    <Tabs defaultValue="board" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-muted/50 h-9 px-0">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <TabsTrigger key={item.name.toLowerCase()} value={item.name.toLowerCase()} className="text-sm px-3 rounded-sm data-[state=active]:bg-background">
                <IconComponent className="h-4 w-4 mr-2" />
                {item.name}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

type ProjectTabContentProps = {
  value: string;
  children: ReactNode;
};

export const ProjectTabContent: FC<ProjectTabContentProps> = ({ value, children }) => {
  return (
    <TabsContent value={value} className="mt-0">
      {children}
    </TabsContent>
  );
};
