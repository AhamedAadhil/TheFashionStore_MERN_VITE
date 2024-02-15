// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TbCategory } from "react-icons/tb";
import PropTypes from "prop-types";

const subTitle = "Choose Any Product";
const title = "Buy Everything With Us";
const btnText = "Get Started Now";

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
    <div className="category-section style-4 padding-tb">
      <div className="container">
        {/* Section header */}
        <div className="section-header text-center">
          <span className="subtitle">{subTitle}</span>
          <h2 className="title">{title}</h2>
        </div>
        {/* Section card */}
        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-md-3 row-cols-sm-2 row-cols-2">
            {data &&
              // eslint-disable-next-line react/prop-types
              data.map((category, index) => (
                <div key={index} className="col">
                  <Link to="/shop" className="category-item">
                    <div className="category-inner">
                      {/* image thumbnail */}
                      <div className="category-thumb">
                        <img src={category.logo} alt={category.title} />
                      </div>
                      {/* content */}
                      <div className="category-content">
                        <div className="cate-icons">
                          <TbCategory
                            style={{ fontSize: "24px", color: "#ffc107" }}
                          />
                        </div>
                        <h6>{category.title}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
          {/* btn get started */}
          <div className="text-center mt-5">
            <Link to="/shop" className="lab-btn">
              <span>{btnText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
