import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";

import { Autoplay } from "swiper/modules";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const cat = "brand";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brand/getAllBrand", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log(response.message);
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="brand-section py-4">
      <div className="container">
        <div className="section-wrapper">
          <h6 className="px-2 mb-2">Brands</h6>
          <div className="sponsor-slider">
            <Swiper
              slidesPerView={4}
              spaceBetween={20}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 5,
                  spaceBetween: 40,
                },
                1024: {
                  slidesPerView: 8,
                  spaceBetween: 50,
                },
              }}
              modules={[Autoplay]}
              className="mySwiper"
            >
              {brands &&
                brands.map(
                  (item, index) =>
                    item.title !== "Others" && (
                      <SwiperSlide key={index}>
                        <div className="sponser-item">
                          <div className="sponser-thumb">
                            <Link
                              to={`/filter/${cat}/${item._id}/${item.title}`}
                            >
                              <img
                                src={item.logo}
                                alt={item.title}
                                height="auto"
                                width="auto"
                              />
                            </Link>
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                )}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
