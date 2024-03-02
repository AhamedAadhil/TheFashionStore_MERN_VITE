import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function BeautyCollections() {
  // Assuming you have an array of image URLs
  const imageUrls = [
    "https://i.ibb.co/W0McFMc/Black-Modern-Elegant-Perfume-Instagram-Story-4.png",
    "https://i.ibb.co/BTzLFMr/Black-Modern-Elegant-Perfume-Instagram-Story-6.png",
    "https://i.ibb.co/0VFp30f/Black-Modern-Elegant-Perfume-Instagram-Story-1.png",
    "https://i.ibb.co/RYD7kV6/Black-Modern-Elegant-Perfume-Instagram-Story-8.png",
    "https://i.ibb.co/smJ9NT1/Black-Modern-Elegant-Perfume-Instagram-Story-7.png",
    "https://i.ibb.co/pjyZCf5/Black-Modern-Elegant-Perfume-Instagram-Story.png",
    "https://i.ibb.co/yqLyG0k/Black-Modern-Elegant-Perfume-Instagram-Story-2.png",
    "https://i.ibb.co/K0WbY1b/Black-Modern-Elegant-Perfume-Instagram-Story-5.png",
  ];

  return (
    <div
      className="container mt-4 py-2"
      style={{
        backgroundImage: `url("https://i.ibb.co/Jczqtbg/Black-Modern-Elegant-Perfume-Instagram-Story-9.png")`,
      }}
    >
      <h6 className="mb-2 px-2 text-white">Beauty Collections</h6>
      <div className="row row-cols-4 row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-3 ">
        {imageUrls.map((url, index) => (
          <div key={index} className="col mb-2 ">
            <Link to="/shop">
              <Image
                src={url}
                alt={`Beauty Collection ${index + 1}`}
                fluid
                className="rounded"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
