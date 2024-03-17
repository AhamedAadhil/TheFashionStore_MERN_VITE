import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function NewProducts({ data: newProducts }) {
  NewProducts.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        imageUrls: PropTypes.array.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        seller: PropTypes.shape({
          shopname: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  };

  if (newProducts === undefined || !Array.isArray(newProducts)) {
    return null;
  }

  return (
    <div className="container mt-4 shadow">
      <div className="section-wrapper">
        <div className="section-header-home-card d-flex justify-content-between align-items-center mb-2">
          <h6 className="title mb-2 mt-2 px-2">New Collections</h6>
          <div>
            <Link
              to={"/shop"}
              className="mx-3"
              style={{ fontSize: "0.8rem", fontWeight: "800" }}
            >
              All&gt;
            </Link>
          </div>
        </div>
        <div className="row g-1 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2 course-filter">
          {newProducts.map((product, index) => (
            <Link
              to={`/shop/${product._id}`}
              key={index}
              className="col mb-3 text-decoration-none"
            >
              {/* Add margin-bottom to create space between cards */}
              <Card
                style={{ width: "auto", height: "18rem", position: "relative" }}
                className="mx-2 shadow"
              >
                <Card.Img
                  variant="top"
                  src={product.imageUrls[0]}
                  style={{ height: "170px", objectFit: "cover" }}
                  /* ideas are fill,cover,contain and height is auto */
                />
                <div className="green-tag">New</div>
                <Card.Body className="p-2">
                  {/* Add padding to the card body */}
                  <Card.Title
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      maxHeight: "3rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    className="text-center"
                  >
                    {product.name}
                  </Card.Title>
                  {/* <Card.Text>{product.description}</Card.Text> */}
                  <Card.Text style={{ fontSize: "1rem" }} className="px-2">
                    <span style={{ color: "#F16126" }}>
                      Rs. {product.price.toFixed(2)}
                    </span>

                    <span style={{ fontSize: "0.8rem" }} className="d-block">
                      By: {product.seller.shopname}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
