/* eslint-disable react/prop-types */
import { HiTrophy } from "react-icons/hi2";
import { IoIosPricetags } from "react-icons/io";
import { MdProductionQuantityLimits } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function PageHeader({
  title,
  avatar,
  points,
  totalSold,
  productLength,
  isVerified,
}) {
  return (
    <div className="pageheader-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="pageheader-content text-center">
              <img
                src={avatar}
                alt="shop img"
                height="100px"
                width="100px"
                className="rounded"
              />
              <div className="d-flex align-items-center justify-content-center">
                <h2 style={{ color: "#F16126", margin: 0 }}>{title}</h2>
                <span style={{ marginLeft: "5px" }}>
                  {isVerified && (
                    <VscVerifiedFilled
                      style={{
                        color: "blue",
                        verticalAlign: "middle",
                        fontSize: "1.5rem",
                      }}
                    />
                  )}
                </span>
              </div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li
                    className="d-flex justify-content-center align-items-center px-2"
                    style={{ borderRight: "1px solid gray" }}
                  >
                    <IoIosPricetags style={{ color: "#F16126" }} /> &nbsp;{" "}
                    <b> Sold: {totalSold}</b>
                  </li>
                  &nbsp;
                  <li
                    className="d-flex justify-content-center align-items-center px-2"
                    style={{ borderRight: "1px solid gray" }}
                  >
                    <HiTrophy style={{ color: "#F16126" }} /> &nbsp;{" "}
                    <b> Points: {points}</b>
                  </li>
                  &nbsp;
                  <li className="d-flex justify-content-center align-items-center px-2">
                    <MdProductionQuantityLimits style={{ color: "#F16126" }} />{" "}
                    &nbsp; <b> Products: {productLength} </b>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
