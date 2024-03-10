import Skeleton from "react-loading-skeleton";

export default function ShopPageSkull() {
  return (
    <div className="min-vh-100 padding-tb" style={{ paddingTop: "80px" }}>
      <div className="shop-page ">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-12">
              <aside>
                <Skeleton height={70} count={1} />
              </aside>
            </div>
            <div className="col-lg-8 col-12">
              <article>
                <div className=" d-flex flex-wrap justify-content-between my-3">
                  <Skeleton width={200} height={50} />
                </div>
                <div className="row">
                  {[1, 2, 3, 4, 5, 6].map((_, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-6 mb-4">
                      <div className="product-card">
                        {/* Product image */}
                        <div className="product-thumb">
                          <Skeleton height={200} />
                        </div>
                        {/* Product content */}
                        <div className="product-content">
                          {/* Description lines */}
                          <Skeleton height={20} />
                          <Skeleton height={20} />
                          <Skeleton height={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton height={50} />
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
