import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay } from "swiper/modules";

export default function Brands() {
  const [brands, setBrands] = useState([]);

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
          <h5
            style={{ fontSize: "1.2rem", fontWeight: "600" }}
            className="px-2"
          >
            Brands
          </h5>
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
                brands.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="sponser-item">
                      <div className="sponser-thumb">
                        <img
                          src={item.logo}
                          alt={item.title}
                          height="auto"
                          width="auto"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}