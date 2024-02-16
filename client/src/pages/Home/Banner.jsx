import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import SelectedCategory from "../../components/SelectedCategory";

const title = (
  <h2>
    Search Your One From <span>Thousend</span> of Products
  </h2>
);

const desc = "We Have The Largest Collection Of Products";
// const bannerList = [
//   { iconName: "icofont-users-alt-4", text: "1.5 Million Customers" },
//   { iconName: "icofont-notification", text: "More then 2000 Marchent" },
//   { iconName: "icofont-globe", text: "Buy Anything Online" },
// ];

export default function Banner() {
  const [data, setData] = useState(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setfilteredProducts] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* search function */
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchInput(searchTerm);

    /* filtering products based on search */
    const filtered = data.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setfilteredProducts(filtered);
  };

  const handleCategorySelect = (selectedValue) => {
    setSelectedCategory(selectedValue);
  };

  /* fetchData */
  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = "/api/product/allProducts";
        // Check if selectedCategory is not "all" and append category parameter if needed
        if (selectedCategory !== "all") {
          apiUrl += `?category=${selectedCategory}`;
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
        console.log(data);
        setData(data);
      } catch (error) {
        console.log("error: ", error.message);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <div className="banner-section style-4">
      <div className="container">
        <div className=" banner-content ">
          {/* {title} */}
          <InputGroup
            className="mb-3 shadow rounded"
            style={{ height: "50px" }}
          >
            <DropdownButton
              variant="outline-secondary"
              title="All Category"
              id="input-group-dropdown-1"
            >
              <Dropdown.Item href="#">Action</Dropdown.Item>
              <Dropdown.Item href="#">Another action</Dropdown.Item>
              <Dropdown.Item href="#">Something else here</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#">Separated link</Dropdown.Item>
            </DropdownButton>
            <Form.Control
              aria-label="Search Your Product..."
              placeholder="Search Your Product..."
            />
          </InputGroup>
          {/* <form>
            <SelectedCategory
              defaultCategory="all"
              onSelect={handleCategorySelect}
            />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Your Product..."
              value={searchInput}
              onChange={handleChange}
            />
            <button type="submit">
              <IoSearch style={{ fontSize: "24px" }} />
            </button>
          </form> */}
          {/* <p>{desc}</p> */}
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
    </div>
  );
}
