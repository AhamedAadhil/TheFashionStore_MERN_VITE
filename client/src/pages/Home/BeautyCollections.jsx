import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function BeautyCollections() {
  // Assuming you have an array of image URLs
  const imageUrls = [
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/beauty-poster-design-template-edb3f4c4e415f98158b6090ee8ac0b28_screen.jpg?ts=1657098318",
    "https://i.ibb.co/rwDr9tk/81-Du-GFbqki-L-SL1500.jpg",
    "https://i.ibb.co/LZrsZGQ/westin-hotel-bath-body-set-HB-308-WT-xlrg.jpg",
    "https://i.ibb.co/bBvXk0w/wholesale-fragrances-main-banner.jpg",
    "https://i.ibb.co/F53PHQP/06-09-2023-maybelline-makeup-products-23523263.jpg",
    "https://i.ibb.co/3F3fRdc/1e5db2bd00a69-hp-most-loved-fs-2column-4.jpg",
    "https://i.ibb.co/vvvQTGC/instant-skin-care-results-main-1522856094.jpg",
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/beauty-poster-design-template-edb3f4c4e415f98158b6090ee8ac0b28_screen.jpg?ts=1657098318",
  ];

  return (
    <div
      className="container mt-4 py-2"
      style={{
        backgroundImage: `url("https://img.freepik.com/free-photo/design-space-paper-textured-background_53876-41740.jpg")`,
      }}
    >
      <h2 className="mb-2" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
        Beauty Collections
      </h2>
      <div className="row row-cols-4 row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-3">
        {imageUrls.map((url, index) => (
          <div key={index} className="col mb-2">
            <Link to="/shop">
              <Image src={url} alt={`Beauty Collection ${index + 1}`} fluid />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
