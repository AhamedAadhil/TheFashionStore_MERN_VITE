import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import CarouselHomeSkull from "./LoadSkulls/CarouselHomeSkull";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function CarouselHome() {
  const [product, setProduct] = useState(undefined);
  const [category, setCategory] = useState(undefined);
  const [carousels, setCarousels] = useState(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [useEffectLoading, setUseEffectLoading] = useState(false);
  const [filteredProducts, setfilteredProducts] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  /* search function */
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);

    /* filtering products based on search */
    const filtered = product.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // setfilteredProducts(filtered);
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
        setUseEffectLoading(true);
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
          setUseEffectLoading(false);
          console.log("if not ok", data.message);
        }
        setUseEffectLoading(false);
        setProduct(data.products);
      } catch (error) {
        setUseEffectLoading(false);
        console.log("error: ", error.message);
      }
    };
    const fetchCategory = async () => {
      try {
        setUseEffectLoading(true);
        const response = await fetch("/api/category/getAllCategory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          setUseEffectLoading(false);
          console.log(response.message);
        }
        setUseEffectLoading(false);
        setCategory(dataFromResponse);
      } catch (error) {
        setUseEffectLoading(false);
        console.log(error.message);
      }
    };
    const fetchCarousels = async () => {
      try {
        setUseEffectLoading(true);
        const response = await fetch("/api/admin/actions/getAllCarousels", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromResponse = await response.json();
        if (!response.ok) {
          setUseEffectLoading(false);
          console.log(response.message);
        }
        setUseEffectLoading(false);
        setCarousels(dataFromResponse);
      } catch (error) {
        setUseEffectLoading(false);
        console.log(error.message);
      }
    };
    fetchProduct();
    fetchCategory();
    fetchCarousels();
  }, [selectedCategory]);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <>
      {useEffectLoading ? (
        <CarouselHomeSkull />
      ) : (
        <>
          <Carousel
            style={{ paddingTop: "80px" }}
            activeIndex={index}
            onSelect={handleSelect}
            controls={false}
            indicators={false}
          >
            {carousels &&
              carousels.map((carousel, index) => (
                <Carousel.Item key={index}>
                  <img
                    onClick={() => navigate(carousel.url)}
                    src={carousel.imageUrl}
                    alt={carousel.url}
                    className="d-block w-100"
                  />
                </Carousel.Item>
              ))}
          </Carousel>
          <div className="container mt-4">
            <div className=" banner-content ">
              {/* <h5>Without a Search How Can You Find Your Product In The Pool?</h5> */}
              <InputGroup className="shadow rounded" style={{ height: "45px" }}>
                <DropdownButton
                  variant="secondary"
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
                    <Dropdown.Item disabled>
                      No categories available
                    </Dropdown.Item>
                  )}
                </DropdownButton>
                {/* <Search /> */}
                <Form.Control
                  value={searchInput}
                  onChange={handleChange}
                  placeholder="Product Name..."
                  className="px-3 py-2 shadow-none"
                />
                {/* <InputGroup.Text className="bg-transparent ">
              <FaSearch />
            </InputGroup.Text> */}
              </InputGroup>
              {searchInput &&
                searchInput.trim() !== "" &&
                filteredProducts.length > 0 && (
                  <ul className="lab-ul mt-3 px-4 border py-2 shadow">
                    {searchInput &&
                      filteredProducts.map((product, index) => (
                        <li
                          key={index}
                          className="search-result-item border-bottom py-3"
                        >
                          <Link
                            to={`/shop/${product._id}`}
                            className="search-result-link"
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="mr-3 rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="flex-grow-1">
                                {" "}
                                {/* Added flex-grow-1 class */}
                                <p
                                  className="mb-1"
                                  style={{
                                    fontSize: "0.9rem",
                                    color: "#F16126",
                                  }}
                                >
                                  &nbsp; {product.name}
                                </p>
                                <p
                                  className="text-muted mb-1"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  &nbsp;&nbsp;
                                  <b>Rs{product.price.toFixed(2)}</b>
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
