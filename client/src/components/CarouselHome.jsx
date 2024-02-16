import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function CarouselHome() {
  const [product, setProduct] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setfilteredProducts] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* search function */
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);

    /* filtering products based on search */
    const filtered = product.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setfilteredProducts(filtered);
  };

  const handleCategorySelect = (selectedValue) => {
    const selectedCategoryObject = category.find(
      (cat) => cat._id === selectedValue
    );
    setSelectedCategory(selectedCategoryObject || "all");
  };

  /* fetchData */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let apiUrl = "/api/product/allProducts";
        if (selectedCategory !== "all") {
          apiUrl += `?category=${selectedCategory._id}`;
        }
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          console.log("if not ok", data.message);
        }
        setProduct(data);
      } catch (error) {
        console.log("error: ", error.message);
      }
    };
    const fetchCategory = async () => {
      try {
        const response = await fetch("/api/category/getAllCategory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(response.message);
        }
        setCategory(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
    fetchCategory();
  }, [selectedCategory]);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      <Carousel
        style={{ paddingTop: "80px" }}
        activeIndex={index}
        onSelect={handleSelect}
        className="px-4"
        controls={false}
      >
        <Carousel.Item>
          <img
            src="/src/assets/images/pageheader/cat-1.jpg"
            alt=""
            className="d-block w-100"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="/src/assets/images/pageheader/cat-1.jpg"
            alt=""
            className="d-block w-100"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src="/src/assets/images/pageheader/cat-1.jpg"
            alt=""
            className="d-block w-100"
          />
        </Carousel.Item>
      </Carousel>
      <div className="container mt-4">
        <div className=" banner-content ">
          <h5>Without a Search How Can You Find Your Product In The Pool?</h5>
          <InputGroup className="shadow rounded" style={{ height: "50px" }}>
            <DropdownButton
              variant="outline-primary"
              title={
                selectedCategory === "all"
                  ? "All Categories"
                  : selectedCategory.title
              }
              id="input-group-dropdown-1"
              onSelect={handleCategorySelect}
            >
              <Dropdown.Item>All Categories</Dropdown.Item>
              {category && category.length > 0 ? (
                category.map((item, index) => (
                  <Dropdown.Item key={index} eventKey={item._id}>
                    {item.title}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>No categories available</Dropdown.Item>
              )}
            </DropdownButton>
            <Form.Control
              aria-label="Search Your Product..."
              placeholder="Search Your Product..."
              value={searchInput}
              onChange={handleChange}
              className="px-3 py-2"
            />
          </InputGroup>
          <ul className="lab-ul">
            {searchInput &&
              filteredProducts.map((product, index) => (
                <li key={index}>
                  <Link to={`/shop/${product._id}`}>{product.name}</Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
