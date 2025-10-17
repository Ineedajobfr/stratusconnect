// Rating Modal Component
// Submit ratings and reviews after completed bookings

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { reputationService } from "@/lib/reputation-service";
import { Loader2, Send, Star } from "lucide-react";
import { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  transactionId?: string;
  onRatingSubmitted?: () => void;
}

export function RatingModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  transactionId,
  onRatingSubmitted
}: RatingModalProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await reputationService.submitRating({
        user_id: targetUserId,
        rated_by: 'current-user-id', // This should come from auth context
        rating,
        review_text: reviewText.trim() || undefined,
        transaction_id: transactionId
      });

      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      setRating(5);
      setReviewText("");
      
      onClose();
      onRatingSubmitted?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRating(5);
      setReviewText("");
      onClose();
    }
  };

  const renderStars = (value: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        className={`h-8 w-8 ${
          i < value
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400 hover:text-yellow-300'
        } transition-colors`}
      >
        <Star className="h-full w-full" />
      </button>
    ));
  };

  const getRatingText = (value: number) => {
    switch (value) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {targetUserName}</DialogTitle>
          <DialogDescription>
            How was your experience with this operator?
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <Label className="text-white">Overall Rating</Label>
                <div className="flex items-center gap-2">
                  {renderStars(rating)}
                </div>
                <p className="text-sm text-gray-300">
                  {getRatingText(rating)}
                </p>
              </div>

              {/* Detailed Rating */}
              <div className="space-y-3">
                <Label className="text-white">Rate Specific Aspects</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Communication</span>
                    <RadioGroup value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-1">
                            <RadioGroupItem value={value.toString()} id={`comm-${value}`} />
                            <Label htmlFor={`comm-${value}`} className="text-xs">{value}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Punctuality</span>
                    <RadioGroup value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-1">
                            <RadioGroupItem value={value.toString()} id={`punct-${value}`} />
                            <Label htmlFor={`punct-${value}`} className="text-xs">{value}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Service Quality</span>
                    <RadioGroup value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-1">
                            <RadioGroupItem value={value.toString()} id={`service-${value}`} />
                            <Label htmlFor={`service-${value}`} className="text-xs">{value}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <Label className="text-white">Review (Optional)</Label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this operator..."
                  className="bg-slate-600 border-slate-500 text-white"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400">
                  {reviewText.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || rating < 1}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Rating
                </Button>
                <Button
                  onClick={handleClose}
                  disabled={submitting}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
