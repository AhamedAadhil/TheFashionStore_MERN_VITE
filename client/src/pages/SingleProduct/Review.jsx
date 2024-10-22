/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyerRating from "./BuyerRating";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaQuestionCircle, FaCommentAlt } from "react-icons/fa";

export default function Review({ id, onUpdate }) {
  const [reviewShow, setReviewShow] = useState(false);
  const [buyerStarRating, setBuyerStarRating] = useState(0);
  const [reviewsOfProduct, setReviewsOfProduct] = useState([]);
  const [QAOfProduct, setQAOfProduct] = useState([]);
  const [review, setReview] = useState("");
  const [qa, setqa] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSetReview = (e) => {
    setReview(e.target.value);
  };

  const handleSetQA = (e) => {
    setqa(e.target.value);
  };

  const postReview = async (e) => {
    try {
      e.preventDefault();

      if (!currentUser || currentUser === "") {
        toast.error("Please Login to Rate This Product!");
        navigate("/login");
        return;
      }
      if (buyerStarRating === 0 || !buyerStarRating) {
        return toast.error("Please  Rate This Product!");
      }
      if (review === "" || !review) {
        return toast.error("Please Enter Your Comment To Submit!");
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

  const postQuestion = async (e) => {
    try {
      e.preventDefault();

      if (!currentUser || currentUser === "") {
        toast.error("Please Login Ask Your Question!");
        navigate("/login");
        return;
      }
      if (qa === "" || !qa) {
        return toast.error("Please Enter Your Question To Submit!");
      }

      setLoading(true);
      const response = await fetch(`/api/question/createQuestion/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: qa,
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setLoading(false);
        return toast.error("Please Login To Ask Question!");
      }

      if (!response.ok) {
        setLoading(false);
        toast.error(data.message);
        return;
      }

      setLoading(false);
      toast.success("Question Added!");
      setQAOfProduct(data);
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
    const fetchQA = async () => {
      try {
        const response = await fetch(`/api/question/getallqa/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response.message);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Data is an array of questions
          setQAOfProduct(data);
        } else {
          console.log(data);
          setQAOfProduct([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
    fetchQA();
  }, [id]);

  console.log(QAOfProduct);

  return (
    <>
      <ul
        className={`review-nav lab-ul ${
          reviewShow ? "RevActive" : "DescActive"
        }`}
      >
        <li className="desc" onClick={() => setReviewShow(!reviewShow)}>
          Questions ({QAOfProduct.length})
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
                <h5>Add Your Review</h5>
              </div>
              <form action="" className="row">
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
                    onClick={postReview}
                    className={`default-button ${loading ? "loading" : ""}`}
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
                      <Link to="#" style={{ color: "#F16126" }}>
                        {review.buyer.username}
                      </Link>
                      <p style={{ fontSize: "1rem" }}>
                        {review.date.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="entry-content">
                    <p style={{ color: "	#ffe234" }}>
                      {review.rating < 6 ? "★".repeat(review.rating) : ""}
                    </p>
                    <p>{review.comment}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* description */}
        <div className="description">
          {/* add review field */}
          <div className="client-review">
            <div className="review-form">
              <div className="review-title">
                <h5>Ask Your Question</h5>
              </div>
              <form action="" className="row">
                <div className="col-md-12 col-12">
                  <textarea
                    name="comment"
                    id="comment"
                    rows="2"
                    placeholder="Type Your Question"
                    value={qa}
                    onChange={handleSetQA}
                  ></textarea>
                </div>
                <div className="col-12">
                  <button
                    onClick={postQuestion}
                    className={`lab-btn my-2`}
                    disabled={loading}
                  >
                    <span>{loading ? "Submitting..." : "Submit Question"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <ul className="content lab-ul px-2">
            {QAOfProduct.length > 0 &&
              QAOfProduct.map((qa, index) => (
                <li key={index}>
                  <div
                    className="post-content"
                    style={{ borderBottom: "1px solid lightgrey" }}
                  >
                    <div className="entry-meta">
                      <div className="posted-on d-flex gap-3 align-items-center justify-content-between">
                        <div>
                          <span style={{ marginLeft: "5px" }}>
                            <FaQuestionCircle style={{ color: "#F16126" }} />{" "}
                            {qa.buyer.username} Asked:
                          </span>
                        </div>
                        <p style={{ fontSize: "1rem" }}>
                          {qa.date.split("T")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="entry-content">
                      <b style={{ color: "#F16126" }}>{qa.question}</b>
                      {qa.answer && (
                        <div
                          className="reply my-2"
                          style={{
                            paddingLeft: "20px",
                            borderLeft: "2px solid green",
                          }}
                        >
                          <div>
                            <FaCommentAlt style={{ color: "green" }} />
                            <span style={{ marginLeft: "5px" }}>
                              {qa.seller.shopname} replied:
                            </span>
                          </div>
                          <b style={{ marginLeft: "20px", color: "green" }}>
                            {qa.answer}
                          </b>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
