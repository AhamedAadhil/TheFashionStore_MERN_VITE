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

export default function Home() {
  const [category, setData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
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
        setData(dataFromResponse);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      {/* <Banner /> */}
      <CarouselHome />
      {/* <Banner /> */}
      {category && <HomeCategory data={category} />}
      <NewProducts />
      <Brands />
      {/* {data && <CategoryShowcase data={data} />} */}
      <SellerRegister />
      {/* <WhoWeAre /> */}
      <BecomeASeller />
      <AppSection />
    </div>
  );
}
