import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function HotCollections() {
  // Assuming you have an array of image URLs
  const imageUrls = [
    "https://i.ibb.co/KLMjbf0/shoe-arrival-instagram-post.png",
    "https://i.ibb.co/R7q3pkQ/Blue-and-White-Limited-Edition-Luxury-Handbag-Instagram-Post.png",
    "https://i.ibb.co/6PjGv7p/Black-and-White-New-Women-Dress-Collection-Instagram-Story.png",
    "https://i.ibb.co/fQq2HZb/Wallet-Instagram-Post.png",
    "https://i.ibb.co/6Dc551r/Green-and-Black-Streetwear-New-Arrival-T-Shirt-Instagram-Story.png",
    "https://i.ibb.co/dDBRcg1/Green-Grey-Simple-Modern-New-Arrival-Instagram-Post.png",
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
        {imageUrls.map((url, index) => (
          <div key={index} className="col mb-2">
            <Link to="/shop">
              <Image
                src={url}
                alt={`Beauty Collection ${index + 1}`}
                fluid
                rounded
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
