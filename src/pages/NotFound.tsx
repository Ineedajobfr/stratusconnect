import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { DemoBanner } from "@/components/DemoBanner";
import { Plane, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-terminal">
      <DemoBanner />
      <div className="fixed top-20 right-6 z-40">
        <NavigationArrows />
      </div>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Plane className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Flight Path Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The terminal you're looking for seems to have changed its flight plan.
        </p>
        <Link to="/">
          <Button className="bg-gradient-primary hover:opacity-90">
            <Home className="w-4 h-4 mr-2" />
            Return to Control Tower
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
