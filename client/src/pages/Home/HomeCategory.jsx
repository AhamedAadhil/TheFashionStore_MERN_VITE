import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// const subTitle = "Choose Any Product";
// const title = "Buy Everything With Us";
const btnText = "Shop More >";
const cat = "category";

// eslint-disable-next-line react/prop-types
export default function HomeCategory({ data: category }) {
  HomeCategory.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  if (category === undefined || !Array.isArray(category)) {
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
            {category.map(
              (category, index) =>
                category.title !== "Others" &&
                category.title !== "Face Cares" &&
                category.title !== "Skin Cares" &&
                category.title !== "Hair Creams" &&
                category.title !== "Shampoos" &&
                category.title !== "Body Sprays" &&
                category.title !== "Perfumes" &&
                category.title !== "Makeup Items" &&
                category.title !== "Personal Cares" && (
                  <SwiperSlide key={index}>
                    <Link
                      to={`/filter/${cat}/${category._id}/${category.title}`}
                      className="category-item"
                    >
                      <div className="category-inner">
                        <div className="category-thumb">
                          <img src={category.logo} alt={category.title} />
                        </div>
                      </div>
                      <p
                        className="text-center .text-truncate lh-1"
                        style={{
                          paddingTop: "0.2rem",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                        }}
                      >
                        {category.title}
                      </p>
                    </Link>
                  </SwiperSlide>
                )
            )}
          </Swiper>
          <Link to="/shop" className="lab-btn-category ">
            <span>{btnText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
