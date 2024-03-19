import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Search from "./Search";
import ShopPageSkull from "../../components/LoadSkulls/ShopPageSkull";

export default function Shop() {
  const [gridList, setGridList] = useState(true);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [productsPerPage] = useState(30);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/product/allProducts?page=${currentPage}&limit=${productsPerPage}&sort=${
            location.search.includes("shuffle") ? "shuffle" : "-createdAt"
          }`,
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
  }, [currentPage, productsPerPage]);

  /* function to change the current page */
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showResults = `Showing ${currentPage * productsPerPage - 30 + 1} - ${
    currentPage * productsPerPage > totalProducts
      ? totalProducts
      : currentPage * productsPerPage
  } Products`;

  return (
    <div className="min-vh-100">
      {/* <PageHeader title="Our Shop Page" currentPage="Shop" /> */}
      {loading ? (
        <ShopPageSkull />
      ) : (
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
      )}
    </div>
  );
}
