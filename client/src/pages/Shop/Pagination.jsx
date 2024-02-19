/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function Pagination({ totalPages, currentPage, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    paginate(pageNumber);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <ul className="default-pagination lab-ul">
      <li>
        <Link
          onClick={() => {
            if (currentPage > 1) {
              handlePageClick(currentPage - 1);
            }
          }}
        >
          <i className="icofont-rounded-left"></i>
        </Link>
      </li>
      {pageNumbers.map((number) => (
        <li
          key={number}
          className={`page-item ${number === currentPage ? "bg-warning" : ""}`}
        >
          <button
            onClick={() => handlePageClick(number)}
            className="bg-transparent"
          >
            {number}
          </button>
        </li>
      ))}
      <li>
        <Link
          onClick={() => {
            if (currentPage < totalPages) {
              handlePageClick(currentPage + 1);
            }
          }}
        >
          <i className="icofont-rounded-right"></i>
        </Link>
      </li>
    </ul>
  );
}
