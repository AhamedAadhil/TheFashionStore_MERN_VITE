import Skeleton from "react-loading-skeleton";
import { Card } from "react-bootstrap";

export default function NewProductsSkull() {
  return (
    <div className="container mt-4 shadow">
      <div className="section-wrapper">
        <div className="section-header-home-card d-flex justify-content-between align-items-center mb-2">
          <Skeleton width={150} height={24} />
          <Skeleton width={50} height={20} />
        </div>
        <div className="row g-1 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2 course-filter">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col mb-3 text-decoration-none">
              <Card
                style={{ width: "auto", height: "18rem" }}
                className="mx-2 shadow"
              >
                <Skeleton height={170} />
                <Card.Body className="p-2">
                  <Skeleton width={120} height={20} />
                  <Skeleton count={2} />
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
