/* eslint-disable react/prop-types */
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function BeautyCollections({ data: category }) {
  const cate = "category";
  // Assuming you have an array of image URLs
  const imageUrls = [
    {
      url: "https://i.ibb.co/W0McFMc/Black-Modern-Elegant-Perfume-Instagram-Story-4.png",
      cat: "Perfumes",
    },
    {
      url: "https://i.ibb.co/BTzLFMr/Black-Modern-Elegant-Perfume-Instagram-Story-6.png",
      cat: "Body Sprays",
    },
    {
      url: "https://i.ibb.co/mGfxFvR/FACE-CARE.png",
      cat: "Face Cares",
    },
    {
      url: "https://i.ibb.co/RYD7kV6/Black-Modern-Elegant-Perfume-Instagram-Story-8.png",
      cat: "Hair Creams",
    },
    {
      url: "https://i.ibb.co/smJ9NT1/Black-Modern-Elegant-Perfume-Instagram-Story-7.png",
      cat: "Shampoos",
    },
    {
      url: "https://i.ibb.co/pjyZCf5/Black-Modern-Elegant-Perfume-Instagram-Story.png",
      cat: "Skin Cares",
    },
    {
      url: "https://i.ibb.co/yqLyG0k/Black-Modern-Elegant-Perfume-Instagram-Story-2.png",
      cat: "Makeup Items",
    },
    {
      url: "https://i.ibb.co/K0WbY1b/Black-Modern-Elegant-Perfume-Instagram-Story-5.png",
      cat: "Personal Cares",
    },
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
        {imageUrls.map((item, index) => (
          <div key={index} className="col mb-2">
            {category.map(
              (catItem) =>
                catItem.title === item.cat && (
                  <Link
                    key={catItem._id}
                    to={`/filter/${cate}/${catItem._id}/${item.cat}`}
                  >
                    <Image
                      key={item.url}
                      src={item.url}
                      alt={`Beauty Collection ${index + 1}`}
                      fluid
                      className="rounded"
                    />
                  </Link>
                )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
