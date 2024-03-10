import Skeleton from "react-loading-skeleton";

export default function CarouselHomeSkull() {
  return (
    <div>
      {/* Your skeleton loading UI */}
      <Skeleton height={400} />
      <div className="container mt-4">
        <div className=" banner-content ">
          <div className="shadow rounded" style={{ height: "45px" }}>
            <Skeleton height={45} />
          </div>
        </div>
      </div>
    </div>
  );
}
