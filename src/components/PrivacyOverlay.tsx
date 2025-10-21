import { Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
interface PrivacyOverlayProps {
  title: string;
  description: string;
  onUnlock: () => void;
  icon?: "shield" | "chart";
}
export const PrivacyOverlay = ({
  title,
  description,
  onUnlock,
  icon = "shield"
}: PrivacyOverlayProps) => {
  const IconComponent = icon === "shield" ? Shield : BarChart3;
  
  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <IconComponent className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button onClick={onUnlock} variant="default">
          Unlock Access
        </Button>
      </div>
    </div>
  );
};
