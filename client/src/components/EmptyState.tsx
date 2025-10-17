import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon: LucideIcon;
  imageSrc?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon, imageSrc }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-testid="empty-state">
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="w-48 h-48 mb-6 opacity-50" />
      ) : (
        <div className="w-24 h-24 mb-6 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      <Button onClick={onAction} data-testid="button-empty-state-action">
        {actionLabel}
      </Button>
    </div>
  );
}
