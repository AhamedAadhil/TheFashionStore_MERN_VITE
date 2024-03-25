/* eslint-disable react/prop-types */
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function HotCollections() {
  const imageUrls = [
    {
      url: "https://i.ibb.co/KLMjbf0/shoe-arrival-instagram-post.png",
      cat: "Shoes",
    },
    {
      url: "https://i.ibb.co/R7q3pkQ/Blue-and-White-Limited-Edition-Luxury-Handbag-Instagram-Post.png",
      cat: "Hand Bags",
    },
    {
      url: "https://i.ibb.co/3vDdVCp/Black-and-White-New-Women-Dress-Collection-Instagram-Story-1.png",
      cat: "Abayas",
    },
    {
      url: "https://i.ibb.co/fQq2HZb/Wallet-Instagram-Post.png",
      cat: "Gadgets",
    },
    {
      url: "https://i.ibb.co/6Dc551r/Green-and-Black-Streetwear-New-Arrival-T-Shirt-Instagram-Story.png",
      cat: "Shirts",
    },
    {
      url: "https://i.ibb.co/dDBRcg1/Green-Grey-Simple-Modern-New-Arrival-Instagram-Post.png",
      cat: "Backpacks",
    },
  ];

  return (
    <div
      className="container mt-4 py-2"
      style={{
        backgroundImage: `url("https://img.freepik.com/free-photo/design-space-paper-textured-background_53876-41740.jpg")`,
      }}
    >
      <h6 className="mb-2 px-2">Coolest Finds</h6>
      <div className="row row-cols-3 row-cols-sm-3 row-cols-md-3 row-cols-lg-3 g-3">
        {imageUrls.map((item, index) => (
          <div key={index} className="col mb-2">
            {item.cat === "Shoes" && (
              <Link to={`/cool/category/Men Shoes`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
            {item.cat === "Hand Bags" && (
              <Link to={`/cool/category/Hand Bags`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
            {item.cat === "Abayas" && (
              <Link to={`/cool/category/Abayas`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
            {item.cat === "Gadgets" && (
              <Link to={`/cool/category/Gadgets`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
            {item.cat === "Shirts" && (
              <Link to={`/cool/category/Shirts`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
            {item.cat === "Backpacks" && (
              <Link to={`/cool/category/Backpacks`}>
                <Image
                  src={item.url}
                  alt={`Beauty Collection ${index + 1}`}
                  fluid
                  rounded
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
