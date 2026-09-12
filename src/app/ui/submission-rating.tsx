type SubmissionRatingProps = {
  rating: number;
  size?: "sm" | "lg";
};

export function SubmissionRating({
  rating,
  size = "sm",
}: SubmissionRatingProps) {
  if (size === "lg") {
    return (
      <p className="font-serif text-6xl tracking-tight tabular-nums">
        {rating}%
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-[var(--accent)]">Rating {rating}%</p>
  );
}
