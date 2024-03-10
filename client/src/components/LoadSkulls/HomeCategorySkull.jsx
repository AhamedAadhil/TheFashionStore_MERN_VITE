import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function HomeCategorySkull() {
  const skeletonCount = 4;

  return (
    <div className="category-section style-4 py-4">
      <div className="container">
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
            {[...Array(skeletonCount).keys()].map((index) => (
              <SwiperSlide key={index}>
                <div className="category-item">
                  <div className="category-inner">
                    <div className="category-thumb">
                      <Skeleton height={100} width={90} />
                    </div>
                    <p>
                      <Skeleton width={80} />
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Button */}
          <div className="text-end">
            <Skeleton width={40} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
