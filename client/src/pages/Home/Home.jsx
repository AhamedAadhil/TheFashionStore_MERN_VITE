import { useState, useEffect } from "react";
import HomeCategory from "./HomeCategory";
import BecomeASeller from "./BecomeASeller";
import Brands from "./Brands";
import CarouselHome from "../../components/CarouselHome";
import NewProducts from "./NewProducts";
import DealsUnder from "./DealsUnder";
import BeautyCollections from "./BeautyCollections";
import HotCollections from "./HotCollections";
import HomeCategorySkull from "../../components/LoadSkulls/HomeCategorySkull";
import NewProductsSkull from "../../components/LoadSkulls/NewProductsSkull";

export default function Home() {
  const [category, setCategory] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [useEffectLoading, setUseEffectLoading] = useState(false);

  useEffect(() => {
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
          return;
        }
        setUseEffectLoading(false);
        setCategory(dataFromResponse);
      } catch (error) {
        setUseEffectLoading(false);
        console.log(error.message);
      }
    };
    const fetchNewProducts = async () => {
      const fourDaysAgo = new Date();
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
      try {
        setUseEffectLoading(true);
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
          setUseEffectLoading(false);
          console.log(dataFromResponse.message);
          return;
        }
        setUseEffectLoading(false);
        setNewProducts(dataFromResponse.products);
      } catch (error) {
        setUseEffectLoading(false);
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
      {useEffectLoading ? (
        <>
          <HomeCategorySkull />
          <NewProductsSkull />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
