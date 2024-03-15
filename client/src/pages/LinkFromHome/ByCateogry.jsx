import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import ProductCard from "../Shop/ProductCard";
import Pagination from "../Shop/Pagination";
import Search from "../Shop/Search";
import ShopPageSkull from "../../components/LoadSkulls/ShopPageSkull";

export default function ByCategory() {
  const [gridList, setGridList] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [productsPerPage] = useState(30);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { cat, val, name } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/product/allProducts?${cat}=${val}&page=${currentPage}&limit=${productsPerPage}&sort=-createdAt`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          console.log(response.message);
          return;
        }
        setLoading(false);
        setProducts(data.products);
        setTotalProducts(data.totalCount);
        setTotalPages(Math.ceil(data.totalCount / productsPerPage));
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchProducts();
  }, [currentPage, productsPerPage, cat, val]);

  /* function to change the current page */
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showResults = `Showing ${currentPage * productsPerPage - 30 + 1} - ${
    currentPage * productsPerPage > totalProducts
      ? totalProducts
      : currentPage * productsPerPage
  } ${name}`;

  return (
    <div className="min-vh-100">
      {/* <PageHeader title="Our Shop Page" currentPage="Shop" /> */}
      {loading ? (
        <ShopPageSkull />
      ) : products.length > 0 ? (
        <div className="shop-page padding-tb">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-12">
                <aside>
                  <Search products={products} />
                </aside>
              </div>
              <div className="col-lg-8 col-12">
                <article>
                  {/* layout and title */}
                  <div className="shop-title d-flex flex-wrap justify-content-between">
                    <p>{showResults}</p>
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
      ) : (
        <div className="shop-page padding-tb" style={{ paddingTop: "100px" }}>
          <div className="container">
            <div className="row justify-content-center">
              <Alert variant="info" className="no-products-message">
                Unfortunately, There Are No {name} {cat} Products Available At
                The Moment
              </Alert>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
