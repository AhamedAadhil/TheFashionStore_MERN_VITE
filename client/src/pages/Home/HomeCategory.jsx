import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { TbCategory } from "react-icons/tb";
import PropTypes from "prop-types";

// const subTitle = "Choose Any Product";
// const title = "Buy Everything With Us";
const btnText = "Shop More >";

// eslint-disable-next-line react/prop-types
export default function HomeCategory({ data }) {
  HomeCategory.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  if (data === undefined || !Array.isArray(data)) {
    return null;
  }

  return (
    <div className="category-section style-4 py-4 ">
      <div className="container">
        {/* Section header */}
        {/* <div className="section-header text-center"> */}
        {/* <span className="subtitle pb-0">Categories</span>
          <h2 className="title">Categories</h2> */}
        {/* </div> */}
        {/* Section card */}
        <div className="section-wrapper">
          <Swiper
            slidesPerView={4}
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
            {data.map((category, index) => (
              <SwiperSlide key={index}>
                <Link to="/shop" className="category-item">
                  <div className="category-inner">
                    <div className="category-thumb">
                      <img src={category.logo} alt={category.title} />
                    </div>
                    {/* <div className="category-content">
                      <div
                        className="cate-icons"
                        style={{
                          display: window.innerWidth > 768 ? "block" : "none",
                        }}
                      >
                        <TbCategory
                          style={{ fontSize: "14px", color: "#ffc107" }}
                        />
                      </div>

                      <h6>{category.title}</h6>
                    </div> */}
                    {/* <p>Hello</p> */}
                  </div>
                  <p
                    className="px-2"
                    style={{ fontWeight: "600", fontSize: "15px" }}
                  >
                    {category.title}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* btn get started */}
          <div className="text-center mt-1">
            <Link to="/shop" className="lab-btn-category">
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
