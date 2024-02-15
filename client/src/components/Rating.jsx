import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";

export default function Rating({ product }) {
  Rating.propTypes = {
    product: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      stars: PropTypes.number.isRequired,
    }).isRequired,
  };

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
      <>
        {filledStars.map((star, index) => (
          <FaStar key={`filled-${index}`} color="#ffc107" />
        ))}
        {outlinedStars.map((star, index) => (
          <FaStar key={`outlined-${index}`} color="#e4e5e9" />
        ))}
      </>
    );
  };

  return <span className="ratings">{renderStars()}</span>;
}
