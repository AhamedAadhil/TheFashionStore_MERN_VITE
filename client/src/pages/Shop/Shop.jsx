import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Search from "./Search";
import ShopCategory from "./ShopCategory";

export default function Shop() {
  const [gridList, setGridList] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [productsPerPage] = useState(30);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/product/allProducts?page=${currentPage}&limit=${productsPerPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          console.log(response.message);
        }
        setProducts(data.products);
        setTotalProducts(data.totalCount);
        setTotalPages(Math.ceil(data.totalCount / productsPerPage));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, [currentPage, productsPerPage]);

  /* function to change the current page */
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //   const[selectedCategory,setSelectedCategory]=useState("All")
  //   const menuItems =[...new Set(Data.map((val)=>val.category))]

  //   const filterItem = (curcat)=>{
  //     const newItem = Data.filter((newVal)=>{
  //         return newVal.category===curcat
  //     })
  //     setSelectedCategory(curcat)
  //     setProducts(newItem)
  //   }

  const showResults = `Showing ${currentPage * productsPerPage - 30 + 1} - ${
    currentPage * productsPerPage > totalProducts
      ? totalProducts
      : currentPage * productsPerPage
  } Products`;

  return (
    <div className="min-vh-100">
      {/* <PageHeader title="Our Shop Page" currentPage="Shop" /> */}
      <div className="shop-page padding-tb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-12">
              <aside>
                <Search gridList={gridList} />
                {/* <ShopCategory
                filterItem={filterItem}
                setItem = {setProducts}
                menuItems={menuItems}
                /> */}
              </aside>
            </div>
            <div className="col-lg-8 col-12">
              <article>
                {/* layout and title */}
                <div className="shop-title d-flex flex-wrap justify-content-between">
                  <p>{showResults}</p>
                  {/* <div
                    className={`product-view-mode ${
                      gridList ? "gridActive" : "listActive"
                    }`}
                  >
                    <Link
                      className="grid"
                      onClick={() => setGridList(!gridList)}
                    >
                      <i className="icofont-ghost"></i>
                    </Link>
                    <Link
                      className="list"
                      onClick={() => setGridList(!gridList)}
                    >
                      <i className="icofont-listine-dots"></i>
                    </Link>
                  </div> */}
                </div>
                {/* product cards */}
                <div>
                  {products && (
                    <ProductCard gridList={gridList} products={products} />
                  )}
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
