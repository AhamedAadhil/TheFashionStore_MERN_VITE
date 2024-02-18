import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
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
        <div className="row g-1 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2 course-filter">
          {newProducts.map((product, index) => (
            <div
              to={`shop/${product._id}`}
              key={index}
              className="col mb-3 text-decoration-none"
            >
              {/* Add margin-bottom to create space between cards */}
              <Card style={{ width: "auto" }} className="mx-2 shadow">
                <Card.Img
                  variant="top"
                  src={product.imageUrls[0]}
                  style={{ height: "170px", objectFit: "cover" }}
                  /* ideas are fill,cover,contain and height is auto */
                />
                <Card.Body className="p-2">
                  {/* Add padding to the card body */}
                  <Card.Title
                    style={{ fontSize: "1rem", fontWeight: "600" }}
                    className="text-center"
                  >
                    {product.name}
                  </Card.Title>
                  {/* <Card.Text>{product.description}</Card.Text> */}
                  <Card.Text style={{ fontSize: "1rem" }} className="px-2">
                    <span className="d-block pb-1">
                      <span style={{ color: "blue" }}>Rs. {product.price}</span>
                      <span
                        className="px-2 rounded"
                        style={{
                          float: "right",

                          border: "0.1rem solid green",
                          color: "green",
                          fontSize: "0.7rem",
                        }}
                      >
                        New
                      </span>
                    </span>

                    <span style={{ fontSize: "0.8rem" }} className="d-block">
                      By: {product.seller.shopname}
                    </span>
                  </Card.Text>
                  {/* <Card.Text style={{ fontSize: "1rem" }} className="px-2">
                    By: {product.seller.shopname}
                  </Card.Text> */}
                </Card.Body>
                {/* <ListGroup className="list-group-flush border-0">
                  <ListGroup.Item className="border-0">
                    Rs. {product.price}
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    {product.seller.shopname}
                  </ListGroup.Item>
                </ListGroup> */}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
