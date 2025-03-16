"use client";

import { useState } from "react";
import { Search, X, AlertCircle, Plus, ChevronDown, Check, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample data - in a real app this would come from your API
const issues = [
  {
    id: "PROJ-1234",
    title: "Fix navigation bug in dashboard",
    status: "open",
    priority: "high",
    assignee: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    created: "2 days ago",
    dueDate: "2023-12-15",
    labels: ["bug", "frontend"],
    sprint: "Current Sprint",
    project: "Website Redesign",
    reporter: "Jamie Smith",
    storyPoints: 3,
    environment: "Production",
  },
  {
    id: "PROJ-1233",
    title: "Implement new authentication flow",
    status: "in-progress",
    priority: "medium",
    assignee: {
      name: "Sam Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ST",
    },
    created: "3 days ago",
    dueDate: "2023-12-20",
    labels: ["feature", "security"],
    sprint: "Current Sprint",
    project: "Auth System",
    reporter: "Morgan Lee",
    storyPoints: 5,
    environment: "Development",
  },
  {
    id: "PROJ-1232",
    title: "Update documentation for API endpoints",
    status: "closed",
    priority: "low",
    assignee: {
      name: "Jamie Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    created: "1 week ago",
    dueDate: "2023-12-10",
    labels: ["documentation"],
    sprint: "Previous Sprint",
    project: "API Platform",
    reporter: "Alex Johnson",
    storyPoints: 2,
    environment: "Staging",
  },
  {
    id: "PROJ-1231",
    title: "Design new onboarding screens",
    status: "open",
    priority: "high",
    assignee: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ML",
    },
    created: "1 week ago",
    dueDate: "2023-12-25",
    labels: ["design", "ux"],
    sprint: "Next Sprint",
    project: "Mobile App",
    reporter: "Sam Taylor",
    storyPoints: 8,
    environment: "Development",
  },
  {
    id: "PROJ-1230",
    title: "Optimize database queries for performance",
    status: "in-progress",
    priority: "medium",
    assignee: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    created: "2 weeks ago",
    dueDate: "2023-12-18",
    labels: ["performance", "backend"],
    sprint: "Current Sprint",
    project: "Database Optimization",
    reporter: "Jamie Smith",
    storyPoints: 5,
    environment: "Staging",
  },
];

// Define filter properties and their possible values
const filterProperties = [
  {
    id: "status",
    name: "Status",
    values: ["open", "in-progress", "closed"],
  },
  {
    id: "priority",
    name: "Priority",
    values: ["high", "medium", "low"],
  },
  {
    id: "assignee",
    name: "Assignee",
    values: Array.from(new Set(issues.map((issue) => issue.assignee.name))),
  },
  {
    id: "labels",
    name: "Label",
    values: Array.from(new Set(issues.flatMap((issue) => issue.labels))),
  },
  {
    id: "sprint",
    name: "Sprint",
    values: Array.from(new Set(issues.map((issue) => issue.sprint))),
  },
  {
    id: "project",
    name: "Project",
    values: Array.from(new Set(issues.map((issue) => issue.project))),
  },
  {
    id: "reporter",
    name: "Reporter",
    values: Array.from(new Set(issues.map((issue) => issue.reporter))),
  },
  {
    id: "environment",
    name: "Environment",
    values: Array.from(new Set(issues.map((issue) => issue.environment))),
  },
  {
    id: "storyPoints",
    name: "Story Points",
    values: Array.from(new Set(issues.map((issue) => issue.storyPoints.toString()))),
  },
];

// Define sort options
const sortOptions = [
  { id: "newest", name: "Newest first" },
  { id: "oldest", name: "Oldest first" },
  { id: "priority-high", name: "Priority (High to Low)" },
  { id: "priority-low", name: "Priority (Low to High)" },
  { id: "due-soon", name: "Due date (Soonest first)" },
  { id: "due-later", name: "Due date (Latest first)" },
];

type Filter = {
  id: string;
  property: string;
  value: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter issues based on search query and filters
  const filteredIssues = issues.filter((issue) => {
    // Search query filter
    const matchesSearch = searchQuery === "" || issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || issue.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply all active filters
    const matchesFilters = filters.every((filter) => {
      const propertyValue = issue[filter.property as keyof typeof issue];

      // Handle array properties (like labels)
      if (Array.isArray(propertyValue)) {
        return propertyValue.includes(filter.value);
      }

      // Handle object properties (like assignee)
      if (filter.property === "assignee") {
        return issue.assignee.name === filter.value;
      }

      // Handle regular properties
      return propertyValue === filter.value;
    });

    return matchesSearch && matchesFilters;
  });

  // Add a filter
  const addFilter = (property: string, value: string) => {
    const filterId = `${property}-${value}`;

    // Don't add duplicate filters
    if (!filters.some((f) => f.id === filterId)) {
      setFilters([...filters, { id: filterId, property, value }]);
    }

    setIsFilterOpen(false);
    setSelectedProperty(null);
  };

  // Remove a filter
  const removeFilter = (filterId: string) => {
    setFilters(filters.filter((filter) => filter.id !== filterId));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters([]);
    setSearchQuery("");
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            In Progress
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Get label for a filter property
  const getFilterPropertyLabel = (propertyId: string) => {
    const property = filterProperties.find((p) => p.id === propertyId);
    return property ? property.name : propertyId;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4">
        <p>Demo Only</p>
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search issues..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex gap-2">
            {/* Filter button with command palette */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  Add Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end" side="bottom" sideOffset={5}>
                {!selectedProperty ? (
                  <Command>
                    <CommandInput placeholder="Search properties..." />
                    <CommandList>
                      <CommandEmpty>No properties found.</CommandEmpty>
                      <CommandGroup>
                        {filterProperties.map((property) => (
                          <CommandItem key={property.id} onSelect={() => setSelectedProperty(property.id)} className="flex items-center justify-between">
                            {property.name}
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                ) : (
                  <Command>
                    <CommandInput placeholder={`Search ${getFilterPropertyLabel(selectedProperty)} values...`} />
                    <CommandList>
                      <CommandEmpty>No values found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem className="text-sm text-muted-foreground" onSelect={() => setSelectedProperty(null)}>
                          <ChevronDown className="h-4 w-4 rotate-90 mr-1" />
                          Back to properties
                        </CommandItem>
                        {filterProperties
                          .find((p) => p.id === selectedProperty)
                          ?.values.map((value) => (
                            <CommandItem key={value} onSelect={() => addFilter(selectedProperty, value)} className="flex items-center justify-between">
                              {value}
                              {filters.some((f) => f.property === selectedProperty && f.value === value) && <Check className="h-4 w-4" />}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.id} value={option.id}>
                      {option.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear filters button - only show when filters are active */}
            {(filters.length > 0 || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.map((filter) => (
              <Badge key={filter.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                <span className="font-medium text-xs text-muted-foreground mr-1">{getFilterPropertyLabel(filter.property)}:</span>
                {filter.value}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeFilter(filter.id)} />
              </Badge>
            ))}
          </div>
        )}

        {/* Results table */}
        {filteredIssues.length > 0 ? (
          <div className="rounded-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="w-[150px]">Assignee</TableHead>
                  <TableHead className="w-[100px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-mono text-sm">{issue.id}</TableCell>
                    <TableCell>{issue.title}</TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar src={issue.assignee.avatar} alt={issue.assignee.name} />
                        <span className="text-sm">{issue.assignee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{issue.created}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No issues found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
