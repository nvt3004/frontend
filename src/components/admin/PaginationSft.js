import { useState } from "react";
import { CaretDoubleLeft, CaretDoubleRight } from "phosphor-react";

const PaginationSft = ({ count, defaultPage, siblingCount, onPageChange = (pagenum)=>{} }) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Tạo mảng các trang cần hiển thị
  const pages = [];
  const totalPages = count;

  // Tính toán các trang cần hiển thị
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Trang đầu tiên
      i === totalPages || // Trang cuối cùng
      (i >= currentPage - siblingCount && i <= currentPage + siblingCount) // Các trang xung quanh
    ) {
      pages.push(i);
    }
  }

  // Thêm dấu ba chấm "..." nếu có các trang bị bỏ qua
  const renderedPages = [];
  pages.forEach((page, index) => {
    if (index > 0 && pages[index] - pages[index - 1] > 1) {
      renderedPages.push("..."); // Dấu ba chấm
    }
    renderedPages.push(page);
  });

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {/* Previous button */}
        <li
          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={(e) => handlePageChange(e, currentPage - 1)}
        >
          <a className="page-link" href="#" aria-label="Previous">
            <CaretDoubleLeft />
          </a>
        </li>

        {/* Page numbers */}
        {renderedPages.map((page, idx) => (
          <li
            key={idx}
            className={`page-item ${currentPage === page ? "active" : ""}`}
            onClick={(e) => page !== "..." && handlePageChange(e, page)}
          >
            <a className="page-link" href="#">
              {page}
            </a>
          </li>
        ))}

        {/* Next button */}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={(e) => handlePageChange(e, currentPage + 1)}
        >
          <a className="page-link" href="#" aria-label="Next">
            <CaretDoubleRight />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationSft;
