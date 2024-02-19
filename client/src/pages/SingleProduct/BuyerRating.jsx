/* eslint-disable react/prop-types */
import { useState } from "react";

const BuyerRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (starCount) => {
    setRating(starCount);
    // Pass the selected star count to the parent component
    onRatingChange(starCount);
  };

  return (
    <div className="buyer-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default BuyerRating;
