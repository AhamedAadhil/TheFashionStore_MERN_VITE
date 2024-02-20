import { useState, useEffect } from "react";
import Banner from "./Banner";
import CategoryShowcase from "./CategoryShowcase";
import HomeCategory from "./HomeCategory";
import SellerRegister from "./SellerRegister";
import WhoWeAre from "./WhoWeAre";
import BecomeASeller from "./BecomeASeller";
import AppSection from "./AppSection";
import Brands from "./Brands";
import CarouselHome from "../../components/CarouselHome";
import NewProducts from "./NewProducts";
import DealsUnder from "./DealsUnder";
import BeautyCollections from "./BeautyCollections";
import HotCollections from "./HotCollections";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
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
    const fetchNewProducts = async () => {
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      try {
        const response = await fetch(
          `/api/product/allProducts?createdAt=${fourDaysAgo.toISOString()}&limit=6`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const dataFromResponse = await response.json();
        if (!response.ok) {
          console.log(dataFromResponse.message);
        }
        setNewProducts(dataFromResponse.products);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCategory();
    fetchNewProducts();
  }, []);

  return (
    <div className="min-vh-100">
      {/* <Banner /> */}
      <CarouselHome />
      {/* <Banner /> */}
      {category.length > 0 && <HomeCategory data={category} />}
      {newProducts.length > 0 && <NewProducts data={newProducts} />}
      <BeautyCollections />
      <Brands />
      <DealsUnder />
      <HotCollections />
      {/* {data && <CategoryShowcase data={data} />} */}
      {/* <SellerRegister /> */}
      {/* <WhoWeAre /> */}
      <BecomeASeller />
      {/* <AppSection /> */}
    </div>
  );
}
