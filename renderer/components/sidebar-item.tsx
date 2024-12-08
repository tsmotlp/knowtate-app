import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarItemProps {
  id: string
  label: string
  icon: LucideIcon
  level?: number
  active?: boolean
  onClick?: () => void
  expanded?: boolean
  onExpand?: () => void;
  showExpandIcon?: boolean
}

export const SidebarItem = ({
  id,
  label,
  icon: Icon,
  level = 0,
  active,
  onClick,
  onExpand,
  expanded,
  showExpandIcon = false,
}: SidebarItemProps) => {
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const ChevronIcon = expanded ? ChevronUp : ChevronDown;

  return (
    <>
      {!!id && (
        <div
          onClick={onClick}
          role="button"
          style={{
            paddingLeft: level ? `${(level * 24) + 12}px` : "12px"
          }}
          className={cn(
            "group min-h-[36px] rounded-md py-2 pr-3 w-full",
            "hover:bg-primary/5 transition-colors duration-200",
            "flex items-center text-muted-foreground",
            "cursor-pointer select-none",
            active && "bg-primary/5 text-primary font-medium",
            level !== 0 && "text-sm"
          )}
        >
          <Icon
            className={cn(
              "shrink-0 h-[18px] w-[18px] mr-2",
              active && "bg-primary/5 text-primary",
              level !== 0 && "h-[16px] w-[16px]"
            )}
          />
          <span className="truncate">
            {label}
          </span>
          {showExpandIcon && (
            <div
              role="button"
              className={cn(
                "h-full flex items-center justify-center",
                "rounded-sm ml-auto",
                "hover:bg-primary/10 transition-colors",
                "p-1"
              )}
              onClick={handleExpand}
            >
              <ChevronIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground/50",
                  "transition-transform duration-200",
                  expanded && "transform rotate-180"
                )}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

SidebarItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}