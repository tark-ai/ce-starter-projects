import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const CustomStar = ({
  filled,
  onClick,
  className,
}: {
  filled: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer ${className}`}
    aria-label={filled ? "Filled star" : "Empty star"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-5 h-5 ${filled ? "text-foreground" : "text-muted-foreground/30"}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

const ReviewProduct = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const submitReview = () => {
    // TODO: send { rating, review } to backend
    setIsOpen(false);
    setRating(0);
    setReview("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 font-light rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background"
        >
          Review product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-none">
        <DialogHeader>
          <DialogTitle className="font-light text-xl">Review product</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <label htmlFor="rating" className="text-sm font-light text-foreground">
              Rating
            </label>
            <div className="flex items-center gap-1" id="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <CustomStar key={star} filled={star <= rating} onClick={() => setRating(star)} />
              ))}
            </div>
          </fieldset>

          <div className="space-y-3">
            <label htmlFor="review-textarea" className="text-sm font-light text-foreground">
              Your review
            </label>
            <Textarea
              id="review-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="min-h-24 resize-none rounded-none font-light"
            />
          </div>

          <Button
            onClick={submitReview}
            disabled={rating === 0 || review.trim() === ""}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          >
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewProduct;
