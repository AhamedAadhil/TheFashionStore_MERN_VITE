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
        backgroundImage: `url("https://i.ibb.co/2nLMr8s/Product-Special-Offer-Sale-Advertising-Aesthetic-Flyer.png")`,
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
        <div className="section-wrapper ">
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
                slidesPerView: 5,
              },
            }}
          >
            <SwiperSlide>
              <Link to="/shop" className="category-item">
                <div>
                  <div className="category-thumb shadow">
                    <Image
                      src="https://i.ibb.co/YWmNMh2/999.png"
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
                  <div className="category-thumb shadow">
                    <Image
                      src="https://i.ibb.co/QkT9F7k/1999.png"
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
                  <div className="category-thumb shadow">
                    <Image
                      src="https://i.ibb.co/mXjfGB1/3999.png"
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
                  <div className="category-thumb shadow">
                    <Image
                      src="https://i.ibb.co/Prhj8ft/6999.png"
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
                  <div className="category-thumb shadow">
                    <Image
                      src="https://i.ibb.co/MMxb40x/9999.png"
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
