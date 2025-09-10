import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Star, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  reviewer_id: string;
  rating: number;
  review_text?: string;
  review_type: string;
  created_at: string;
  profiles?: {
    display_name: string;
    platform_role: string;
  };
}

interface ReviewsListProps {
  userId: string;
  className?: string;
}

export default function ReviewsList({ userId, className = "" }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [userId, fetchReviews]);

  const fetchReviews = useCallback(async () => {
              try {
                const { data, error } = await supabase
                  .from("user_reviews")
                  .select(`
          *,
          profiles!user_reviews_reviewer_id_fkey (
            display_name,
            platform_role
          )
        `)
                  .eq("reviewee_id", userId)
                  .order("created_at", { ascending: false });

                if (error) throw error;

                const reviewsData = data || [];
                setReviews(reviewsData);
                
                if (reviewsData.length > 0) {
                  const avg = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
                  setAverageRating(Math.round(avg * 10) / 10);
                } else {
                  setAverageRating(0);
                }
              } catch (error) {
                console.error("Error fetching reviews:", error);
              } finally {
                setLoading(false);
              }
            }, [data, from, select, eq, userId, order, ascending, length, reduce, rating, round]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(Math.floor(averageRating))}
              <span className="text-sm text-muted-foreground">
                {averageRating}/5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border-l-4 border-primary/20 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium">
                      {review.profiles?.display_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {review.profiles?.platform_role || "User"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.review_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}