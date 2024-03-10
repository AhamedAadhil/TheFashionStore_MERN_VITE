import Skeleton from "react-loading-skeleton";

export default function CartPageSkull() {
  return (
    <div className="shop-cart padding-tb">
      <div className="container py-4">
        <div className="section-wrapper">
          <div className="cart-top">
            <table>
              <thead>
                <tr>
                  <th className="cat-product">
                    <Skeleton width={150} />
                  </th>
                  <th className="cat-price">
                    <Skeleton width={80} />
                  </th>
                  <th className="cat-quantity">
                    <Skeleton width={60} />
                  </th>
                  <th className="cat-toprice">
                    <Skeleton width={100} />
                  </th>
                  <th className="cat-edit">
                    <Skeleton width={30} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="product-item cat-product">
                      <Skeleton height={50} />
                    </td>
                    <td className="cat-price">
                      <Skeleton />
                    </td>
                    <td className="cat-quantity">
                      <Skeleton />
                    </td>
                    <td className="cat-toprice">
                      <Skeleton />
                    </td>
                    <td className="cat-edit">
                      <Skeleton width={30} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-bottom">
            <div className="cart-checkout-box">
              <form className="coupon d-flex gap-3">
                {/* <input type="text" placeholder="Coupon Code" disabled />
                <input type="submit" value="Apply Coupon" disabled /> */}
                <Skeleton width={150} height={50} />
                <Skeleton width={150} height={50} />
              </form>
            </div>
            <div className="shiping-box">
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="calculate-shiping">
                    <h3>
                      <Skeleton width={150} />
                    </h3>
                    <div className="outline-select">
                      <select disabled>
                        <option disabled>Select</option>
                      </select>
                      <span className="select-icon">
                        <Skeleton />
                      </span>
                    </div>
                    <div>
                      <Skeleton count={5} />
                    </div>
                    <div className="d-flex justify-content-around align-items-center  mt-4">
                      <Skeleton width={150} height={50} />

                      <Skeleton width={30} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="cart-overview">
                    <h3>
                      <Skeleton width={150} />
                    </h3>
                    <ul className="lab-ul">
                      {[...Array(4)].map((_, index) => (
                        <li key={index}>
                          <span className="pull-left">
                            <Skeleton width={100} />
                          </span>
                          <p className="pull-right">
                            <Skeleton width={80} />
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
