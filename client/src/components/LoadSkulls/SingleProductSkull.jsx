import Skeleton from "react-loading-skeleton";

export default function SingleProductSkull() {
  return (
    <div className="shop-single padding-tb aside-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-12">
            <article>
              <div className="product-details">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <div className="product-thumb">
                      <Skeleton height={326} />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="post-content">
                      <Skeleton height={24} width={200} />
                      <Skeleton count={5} />
                      <Skeleton height={32} width={150} />
                      <Skeleton height={32} width={150} />
                      <Skeleton height={32} width={150} />
                      <Skeleton height={32} width={150} />
                      <Skeleton height={32} width={150} />
                      <Skeleton height={32} width={150} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="review">
                <div className="row">
                  <div className="col">
                    <Skeleton height={32} />
                    <Skeleton height={120} count={3} />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
