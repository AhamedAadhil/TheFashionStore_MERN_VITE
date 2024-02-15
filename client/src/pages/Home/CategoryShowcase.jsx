import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Rating from "../../components/Rating";

// eslint-disable-next-line react/prop-types
export default function CategoryShowcase({ data }) {
  CategoryShowcase.propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      })
    ).isRequired,
  };

  const title = "Our Products";

  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/allProducts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(dataFromResponse.message);
        }
        setItems(dataFromResponse);
        setOriginalItems(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, []);

  if (data === undefined || !Array.isArray(data)) {
    return null;
  }
  /* category based filterning */
  const filterItem = (categoryItem) => {
    if (categoryItem === "All") {
      // If the category is "All", reset items to the original data
      setItems(originalItems);
    } else {
      // Otherwise, filter items based on the selected category
      const updateItems = originalItems.filter((item) => {
        return item.category && item.category.title === categoryItem;
      });
      setItems(updateItems);
    }
  };

  return (
    <div className="course-section style-3 padding-tb">
      {/* shapes */}
      <div className="course-shape one">
        <img src="/src/assets/images/shape-img/icon/01.png" alt="" />
      </div>
      <div className="course-shape two">
        <img src="/src/assets/images/shape-img/icon/02.png" alt="" />
      </div>
      {/* main section */}
      <div className="container">
        {/* section header */}
        <div className="section-header">
          <h2 className="title">{title}</h2>
          <div className="course-filter-group">
            <ul className="lab-ul ">
              <li onClick={() => filterItem("All")}>All</li>

              {data &&
                data.map((category, index) => (
                  <li key={index} onClick={() => filterItem(category.title)}>
                    {category.title.toUpperCase()}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        {/* section body */}
        <div className="section-wrapper">
          <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2 course-filter">
            {items &&
              items.map((product) => (
                <div key={product._id} className="col">
                  <div className="course-item style-4">
                    <div className="course-inner">
                      <div className="course-thumb">
                        <img
                          src={
                            product.imageUrls && product.imageUrls.length > 0
                              ? product.imageUrls[0]
                              : ""
                          }
                          alt={product.name}
                        />

                        <div className="course-category">
                          {product.category && (
                            <div className="course-cate">
                              <Link>{product.category.title}</Link>
                            </div>
                          )}
                          <div className="course-review">
                            <Rating product={product} />
                          </div>
                        </div>
                      </div>
                      {/* content */}
                      <div className="course-content">
                        <Link to={`/shop/${product._id}`}>
                          <h5>{product.name}</h5>
                        </Link>
                        <div className="course-footer">
                          <div className="course-author">
                            <Link to="/" className="ca-name">
                              {product.brand.title}
                            </Link>
                          </div>
                          <div className="course-price">
                            Rs. {product.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
