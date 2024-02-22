/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function Rating({ product }) {
  const [filledStars, setFilledStars] = useState([]);

  useEffect(() => {
    const filledStarsArray = Array.from(
      { length: product.stars },
      (_, index) => index + 1
    );
    setFilledStars(filledStarsArray);
  }, [product]);

  const renderStars = () => {
    const maxStars = 5;
    const filledStarsCount = product.stars;
    const outlinedStarsCount = maxStars - filledStarsCount;

    const filledStars = Array.from(
      { length: filledStarsCount },
      (_, index) => index + 1
    );

    const outlinedStars = Array.from(
      { length: outlinedStarsCount },
      (_, index) => index + 1 + filledStarsCount
    );

    return (
      <div className="">
        {filledStars.map((star, index) => (
          <FaStar key={`filled-${index}`} color="#ffc107" />
        ))}
        {outlinedStars.map((star, index) => (
          <FaStar key={`outlined-${index}`} color="#e4e5e9" />
        ))}
        <span>&nbsp;({product?.reviewhistory?.length})</span>
      </div>
    );
  };

  return <div>{renderStars()}</div>;
}
