import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Item {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  trait_map: Record<string, unknown>;
  module_id: string;
  module_code: string;
}

interface PsychTestRunnerProps {
  sessionId: string;
}

export default function PsychTestRunner({ sessionId }: PsychTestRunnerProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [msStart, setMsStart] = useState(Date.now());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let live = true;
    loadTestItems();

    async function loadTestItems() {
      try {
        // Get session details
        const { data: session, error: sessionError } = await supabase
          .from("psych_sessions")
          .select(`
            *,
            psych_tests(code, id)
          `)
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;

        // Get modules for this test
        const { data: modules, error: modulesError } = await supabase
          .from("psych_modules")
          .select("id, code, name, item_count")
          .eq("test_id", session.psych_tests.id)
          .order("order_index", { ascending: true });

        if (modulesError) throw modulesError;

        // Get items for each module
        const allItems: Item[] = [];
        for (const module of modules) {
          const { data: moduleItems, error: itemsError } = await supabase
            .from("psych_items")
            .select("id, type, payload, trait_map")
            .eq("module_id", module.id)
            .eq("is_active", true)
            .limit(module.item_count);

          if (itemsError) throw itemsError;

          moduleItems?.forEach((item: Record<string, unknown>) => {
            allItems.push({
              ...item,
              module_id: module.id,
              module_code: module.code
            });
          });
        }

        if (!live) return;

        // Shuffle items for random order
        const shuffled = shuffleArray([...allItems]);
        setItems(shuffled);
        setMsStart(Date.now());
      } catch (error: unknown) {
        console.error("Error loading test items:", error);
        toast({
          title: "Error",
          description: "Failed to load test items",
          variant: "destructive"
        });
      } finally {
        if (live) setLoading(false);
      }
    }

    return () => { live = false; };
  }, [sessionId]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const currentItem = items[currentIndex];
  const progress = useMemo(() => 
    items.length ? Math.round((currentIndex / items.length) * 100) : 0, 
    [currentIndex, items.length]
  );

  const handleAnswer = async (value: unknown) => {
    if (!currentItem || saving) return;

    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const msElapsed = Date.now() - msStart;

      const { error } = await supabase.from("psych_responses").insert({
        session_id: sessionId,
        item_id: currentItem.id,
        module_id: currentItem.module_id,
        user_id: user.user.id,
        response: value,
        ms_elapsed: msElapsed
      });

      if (error) throw error;

      setMsStart(Date.now());

      if (currentIndex + 1 < items.length) {
        setCurrentIndex(i => i + 1);
      } else {
        // Test completed - finalize scores
        await finalizeTest();
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save response",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const finalizeTest = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('psych-finalize', {
        body: {
          session_id: sessionId,
          user_id: user.user.id
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Assessment Complete!",
        description: "Your results are ready to view.",
        variant: "default"
      });

      // Navigate to results
      setTimeout(() => {
        window.location.href = `/psych/report/${sessionId}`;
      }, 1000);

    } catch (error: unknown) {
      console.error("Error finalizing test:", error);
      toast({
        title: "Error",
        description: "Failed to finalize assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No items available</h2>
          <p className="text-muted-foreground">Unable to load test items.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {items.length}
          </span>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <Card className="p-8">
        {currentItem.type === "likert" && (
          <LikertQuestion
            item={currentItem}
            onAnswer={(value: number) => handleAnswer({ value })}
            disabled={saving}
          />
        )}
        
        {currentItem.type === "scenario" && (
          <ScenarioQuestion
            item={currentItem}
            onAnswer={(option: number) => handleAnswer({ option })}
            disabled={saving}
          />
        )}
      </Card>
    </div>
  );
}

interface LikertQuestionProps {
  item: Item;
  onAnswer: (value: number) => void;
  disabled: boolean;
}

function LikertQuestion({ item, onAnswer, disabled }: LikertQuestionProps) {
  const scale = item.payload?.scale || [1, 2, 3, 4, 5];
  const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-relaxed">
        {item.payload.text}
      </h2>
      
      <div className="space-y-3">
        {scale.map((value: number, index: number) => (
          <Button
            key={value}
            variant="outline"
            size="lg"
            className="w-full justify-start text-left h-auto py-4"
            onClick={() => onAnswer(value)}
            disabled={disabled}
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-semibold">
                {value}
              </div>
              <span>{labels[index] || `Level ${value}`}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface ScenarioQuestionProps {
  item: Item;
  onAnswer: (option: number) => void;
  disabled: boolean;
}

function ScenarioQuestion({ item, onAnswer, disabled }: ScenarioQuestionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Situational Judgment</h2>
        <p className="text-lg leading-relaxed mb-6 bg-muted/50 p-4 rounded-lg">
          {item.payload.stem}
        </p>
      </div>
      
      <div className="space-y-3">
        <p className="font-medium">What would you do?</p>
        {item.payload.options.map((option: string, index: number) => (
          <Button
            key={index}
            variant="outline"
            size="lg"
            className="w-full justify-start text-left h-auto py-4"
            onClick={() => onAnswer(index)}
            disabled={disabled}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-semibold text-sm">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1">{option}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}