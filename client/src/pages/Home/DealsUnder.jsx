import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "react-bootstrap/Image";
// import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export default function DealsUnder() {
  return (
    <div
      className="category-section style-4 py-4"
      style={{
        backgroundImage: `url("https://i.ibb.co/VM9MBDF/Blue-Neon-Glow-Texture-Background-Zoom-Virtual-Background.png")`,
      }}
    >
      <div className="container">
        <h6 className="px-2">Explore More Deals</h6>
        {/* Section header */}
        {/* <div className="section-header text-center"> */}
        {/* <span className="subtitle pb-0">Categories</span>
          <h2 className="title">Categories</h2> */}
        {/* </div> */}
        {/* Section card */}
        <div className="section-wrapper shadow">
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            <SwiperSlide>
              <Link to="/shop" className="category-item">
                <div>
                  <div className="category-thumb">
                    <Image
                      src="https://i.ibb.co/zxNRY3L/big-sale-banner-design-template-vector-9351949.jpg"
                      alt="deals"
                      rounded
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/shop" className="category-item">
                <div>
                  <div className="category-thumb">
                    <Image
                      src="https://i.ibb.co/7K77DLh/deal-2000.jpg"
                      alt="alt"
                      rounded
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/shop" className="category-item">
                <div>
                  <div className="category-thumb">
                    <Image
                      src="https://img.freepik.com/free-vector/dollar-one-deal-sale-banner_1017-31780.jpg?w=740&t=st=1708148849~exp=1708149449~hmac=8b0c1d338515c6347d9eb19236c58d319f77db50b5ec1e02d4743d9ed95813a4"
                      alt="alt"
                      rounded
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link to="/shop" className="category-item">
                <div>
                  <div className="category-thumb">
                    <Image
                      src="https://img.freepik.com/free-vector/dollar-one-deal-sale-banner_1017-31780.jpg?w=740&t=st=1708148849~exp=1708149449~hmac=8b0c1d338515c6347d9eb19236c58d319f77db50b5ec1e02d4743d9ed95813a4"
                      alt="alt"
                      rounded
                    />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          </Swiper>
          {/* btn get started */}
          {/* <div className="text-center"> */}
          {/* <Link to="/shop" className="lab-btn-category ">
            <span>More &gt;</span>
          </Link> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
