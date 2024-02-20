/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BuyerRating from "./BuyerRating";

export default function Review({ id, desc }) {
  const [reviewShow, setReviewShow] = useState(true);
  const [buyerStarRating, setBuyerStarRating] = useState(0);
  const [reviewsOfProduct, setReviewsOfProduct] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/review/getSingleProductReview/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.log(response.message);
        }
        const data = await response.json();
        setReviewsOfProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [id]);

  return (
    <>
      <ul
        className={`review-nav lab-ul ${
          reviewShow ? "RevActive" : "DescActive"
        }`}
      >
        <li className="desc" onClick={() => setReviewShow(!reviewShow)}>
          Description
        </li>
        <li className="rev" onClick={() => setReviewShow(!reviewShow)}>
          Reviews ({reviewsOfProduct.length})
        </li>
      </ul>
      {/* desc and review content */}
      <div
        className={`review-content ${
          reviewShow ? "review-content-show" : "description-show"
        }`}
      >
        <div className="review-showing">
          <ul className="content lab-ul">
            {reviewsOfProduct.map((review, index) => (
              <li key={index}>
                <div className="post-thumb">
                  <img src={review.buyer.avatar} alt="" />
                </div>
                <div className="post-content">
                  <div className="entry-meta">
                    <div className="posted-on">
                      <Link to="#">{review.buyer.username}</Link>
                      <p>{review.date.split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="entry-content">
                    <p>{review.rating < 6 ? "★".repeat(review.rating) : ""}</p>
                    <p>{review.comment}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* add review field */}
          <div className="client-review">
            <div className="review-form">
              <div className="review-title">
                <h5>Add a Review</h5>
              </div>
              <form action="" className="row">
                {/* <div className="col-md-4 col-12">
                  <input type="text" name="name" id="name" placeholder="name" />
                </div>
                <div className="col-md-4 col-12">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="your email"
                  />
                </div> */}
                <div className="col-md-4 col-12">
                  <div className="rating">
                    <span className="me-2">Your Rating</span>
                    <BuyerRating
                      onRatingChange={(starCount) =>
                        setBuyerStarRating(starCount)
                      }
                    />
                  </div>
                </div>
                <div className="col-md-12 col-12">
                  <textArea
                    name="comment"
                    id="comment"
                    rows="8"
                    placeholder="Type Your Message"
                  ></textArea>
                </div>
                <div className="col-12">
                  <button type="submit" className="default-button">
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* description */}
        <div className="description">
          <p>{desc}</p>
        </div>
      </div>
    </>
  );
}
