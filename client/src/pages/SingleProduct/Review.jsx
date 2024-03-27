/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyerRating from "./BuyerRating";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Review({ id, desc, onUpdate }) {
  const [reviewShow, setReviewShow] = useState(false);
  const [buyerStarRating, setBuyerStarRating] = useState(0);
  const [reviewsOfProduct, setReviewsOfProduct] = useState([]);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSetReview = (e) => {
    setReview(e.target.value);
  };

  const postReview = async (e) => {
    try {
      e.preventDefault();
      if (buyerStarRating === 0 || !buyerStarRating) {
        return toast.error("Please  Rate This Product!");
      }
      if (review === "" || !review) {
        return toast.error("Please Enter Your Comment To Submit!");
      }
      if (!currentUser || currentUser === "") {
        toast.error("Please Login to Rate This Product!");
        navigate("/login");
        return;
      }
      setLoading(true);
      const response = await fetch(`/api/review/createReviewForProduct/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: buyerStarRating,
          comment: review,
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setLoading(false);
        return toast.error("Please Login To Add Comment!");
      }
      if (response.status === 405) {
        setLoading(false);
        return toast.error(
          "You Have To Purchase This Prodcut Before Reviewing It!"
        );
      }
      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }

      setLoading(false);
      toast.success("Review Added!");
      setReview("");
      setBuyerStarRating(0);
      setReviewsOfProduct(data);
      onUpdate();
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

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
          {/* add review field */}
          <div className="client-review">
            <div className="review-form">
              <div className="review-title">
                <h5>Add a Review</h5>
              </div>
              <form action="" className="row" onSubmit={postReview}>
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
                  <textarea
                    name="comment"
                    id="comment"
                    rows="2"
                    placeholder="Type Your Message"
                    value={review}
                    onChange={handleSetReview}
                  ></textarea>
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="default-button"
                    disabled={loading}
                  >
                    <span>{loading ? "Submitting..." : "Submit Review"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <ul className="content lab-ul px-2">
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
        </div>
        {/* description */}
        <div className="description" style={{ whiteSpace: "pre-line" }}>
          <p>{desc}</p>
        </div>
      </div>
    </>
  );
}
