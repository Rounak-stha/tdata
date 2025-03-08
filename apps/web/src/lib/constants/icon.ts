import { IconType } from "@types";
import {
  ArchiveIcon,
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  BanIcon,
  BookIcon,
  BriefcaseIcon,
  BugIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  CirclePauseIcon,
  ConstructionIcon,
  DatabaseIcon,
  EyeIcon,
  GoalIcon,
  HammerIcon,
  HandshakeIcon,
  LockIcon,
  LucideSignalMedium,
  PlayIcon,
  PocketKnifeIcon,
  RotateCwIcon,
  ShieldAlertIcon,
  type LucideIcon,
} from "lucide-react";

export const IconMap: Record<IconType, LucideIcon> = {
  Approval: HandshakeIcon,
  Archive: ArchiveIcon,
  Backlog: CircleDashedIcon,
  Blocked: ConstructionIcon,
  Bug: BugIcon,
  Completed: CheckCircle2Icon,
  Error: BanIcon,
  Escalate: ArrowBigUpDashIcon,
  Epic: BriefcaseIcon,
  Goal: GoalIcon,
  Hold: CirclePauseIcon,
  Improvement: HammerIcon,
  InProgress: CircleDotIcon,
  InReview: EyeIcon,
  Lock: LockIcon,
  Revisit: RotateCwIcon,
  Start: PlayIcon,
  Story: BookIcon,
  Task: PocketKnifeIcon,
  ToDo: CircleIcon,
  Low: ArrowBigDownDashIcon,
  Medium: LucideSignalMedium,
  High: ArrowBigUpDashIcon,
  Urgent: ShieldAlertIcon,
  Database: DatabaseIcon,
};

/**
 * We can safely use the color classes from Tailwind CSS to color the icons here as the file path is added in the tailwind config
 * Thus the classes are available in the final CSS file
 * @see tailwind.config.ts
 */
export const IconColorMap: Record<IconType, string> = {
  Approval: "text-green-500", // Represents a positive action, like approval
  Archive: "text-gray-500", // Neutral color for stored or archived items
  Backlog: "text-yellow-500", // Attention-drawing color, indicating pending work
  Blocked: "text-slate-500", // Strong warning for issues or blocks
  Bug: "text-red-600",
  Completed: "text-green-500", // Calm and positive, representing completion
  Error: "text-red-600", // Bold and urgent for errors
  Escalate: "text-orange-500", // Alert color for urgency
  Epic: "text-blue-500",
  Goal: "text-green-600", // Ambitious and positive
  Hold: "text-gray-400", // Muted, representing inactive state
  Improvement: "text-yellow-500",
  InProgress: "text-blue-400", // Calm and active
  InReview: "text-indigo-500", // Professional and reflective of assessment
  Lock: "text-gray-700", // Neutral, representing restriction
  Revisit: "text-purple-500", // Creative color for rethinking
  Start: "text-green-400", // Optimistic and motivational
  Story: "text-green-500",
  Task: "text-indigo-500",
  ToDo: "text-teal-500", // Fresh and actionable
  Low: "text-gray-400", // Subtle and low-key color for low priority
  Medium: "text-blue-500", // Balanced and noticeable color for medium priority
  High: "text-orange-500", // Alert color for high priority
  Urgent: "text-red-600", // Bold and urgent color for critical priority
  Database: "text-blue-500",
};
