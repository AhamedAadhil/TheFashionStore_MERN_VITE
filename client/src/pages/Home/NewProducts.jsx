import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

export default function NewProducts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      try {
        const response = await fetch(
          `/api/product/allProducts?createdAt=${fourDaysAgo.toISOString()}&limt=6`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(dataFromResponse.message);
        }
        setData(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="section-wrapper">
        <div className="section-header-home-card d-flex justify-content-between align-items-center mb-2">
          <h5
            className="title mb-0 mx-2"
            style={{ fontSize: "1.2rem", fontWeight: "600" }}
          >
            New Collections
          </h5>
          <div>
            <span
              className="mx-3"
              style={{ fontSize: "0.8rem", fontWeight: "800" }}
            >
              All&gt;
            </span>
          </div>
        </div>
        <div className="row g-1 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2 course-filter">
          {data.map((product, index) => (
            <div key={index} className="col mb-3">
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
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush border-0">
                  <ListGroup.Item className="border-0">
                    {product.price}
                  </ListGroup.Item>
                  <ListGroup.Item className="border-0">
                    {product.seller.shopname}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
