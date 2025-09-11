import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PersonalityLauncher from "@/components/psych/PersonalityLauncher";
import PsychTestRunner from "@/components/psych/PsychTestRunner";
import PsychReport from "@/components/psych/PsychReport";
import { supabase } from "@/integrations/supabase/client";

export default function PersonalityTest() {
  const { action, sessionId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setUser({
        ...authUser,
        user_id: authUser.id,
        ...profile
      });
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Route to appropriate component
  if (action === "run" && sessionId) {
    return <PsychTestRunner sessionId={sessionId} />;
  }

  if (action === "report" && sessionId) {
    return <PsychReport sessionId={sessionId} />;
  }

  // Default to launcher
  return <PersonalityLauncher user={user} />;
}