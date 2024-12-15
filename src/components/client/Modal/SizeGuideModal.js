"use client";

import React, { useEffect , useState} from "react";

export default function SizeGuide({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("tops");
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Offcanvas */}
      <div
        className={`offcanvas offcanvas-end position-fixed ontop ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{ visibility: isOpen ? "visible" : "hidden" }}
        aria-labelledby="sizeGuideOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sizeGuideOffcanvasLabel">
            Hướng dẫn kích thước
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            aria-label="Đóng"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="size-guide">
            <div className="size-guide__tabs">
              <button
                className={`size-guide__tab ${
                  activeTab === "tops" ? "size-guide__tab--active" : ""
                }`}
                onClick={() => setActiveTab("tops")}
              >
             Áo
              </button>
              <button
                className={`size-guide__tab ${
                  activeTab === "bottoms" ? "size-guide__tab--active" : ""
                }`}
                onClick={() => setActiveTab("bottoms")}
              >
        Quần
              </button>
            </div>
            <div className="size-guide__content">
              <table
                className={`size-guide__table ${
                  activeTab === "tops" ? "size-guide__table--active" : ""
                }`}
              >
                <thead>
                  <tr>
                  <th>Kích thước</th>
                    <th>Vòng ngực (cm)</th>
                    <th>Vòng eo (cm)</th>
                    <th>Vòng hông (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>82-87</td>
                    <td>66-71</td>
                    <td>90-95</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>88-93</td>
                    <td>72-77</td>
                    <td>96-101</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>94-99</td>
                    <td>78-83</td>
                    <td>102-107</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>100-105</td>
                    <td>84-89</td>
                    <td>108-113</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>106-111</td>
                    <td>90-95</td>
                    <td>114-119</td>
                  </tr>
                </tbody>
              </table>
              <table
                className={`size-guide__table ${
                  activeTab === "bottoms" ? "size-guide__table--active" : ""
                }`}
              >
                <thead>
                  <tr>
                  <th>Kích thước</th>
                    <th>Vòng eo (cm)</th>
                    <th>Vòng hông (cm)</th>
                    <th>Chiều dài (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>66-71</td>
                    <td>90-95</td>
                    <td>76</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>72-77</td>
                    <td>96-101</td>
                    <td>77</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>78-83</td>
                    <td>102-107</td>
                    <td>78</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>84-89</td>
                    <td>108-113</td>
                    <td>79</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>90-95</td>
                    <td>114-119</td>
                    <td>80</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="size-guide__info">
            <p>
                Kích thước được tính bằng cm. Để có kích thước phù hợp nhất, hãy đo cơ thể bạn và so sánh với bảng kích thước bên trên.
              </p>
              <ul>
                <li>
                  Vòng ngực: Đo xung quanh phần rộng nhất của ngực, giữ thước dây nằm ngang.
                </li>
                <li>
                  Vòng eo: Đo xung quanh vòng eo tự nhiên của bạn, giữ thước dây thoải mái.
                </li>
                <li>
                  Vòng hông: Đo xung quanh phần rộng nhất của hông, giữ thước dây nằm ngang.
                </li>
                <li>
                  Chiều dài: Đo từ đáy quần đến phần cuối của ống quần.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .size-guide {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .size-guide__title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .size-guide__tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .size-guide__tab {
          background-color: #f0f0f0;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .size-guide__tab:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
        .size-guide__tab:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
        .size-guide__tab--active {
          background-color: #717fe0;
          color: white;
        }
        .size-guide__content {
          overflow-x: auto;
        }
        .size-guide__table {
          width: 100%;
          border-collapse: collapse;
          display: none;
        }
        .size-guide__table--active {
          display: table;
        }
        .size-guide__table th,
        .size-guide__table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }
        .size-guide__table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .size-guide__table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .size-guide__info {
          margin-top: 20px;
          font-size: 14px;
          line-height: 1.5;
        }
        .size-guide__info ul {
          padding-left: 20px;
          margin-top: 10px;
        }
       .offcanvas {
          transition: transform 0.3s ease-in-out;
          transform: ${isOpen ? "translateX(0)" : "translateX(100%)"};
          visibility: ${isOpen ? "visible" : "hidden"};
        }
        .show {
          transform: translateX(0);
        }

        @media (max-width: 600px) {
          .size-guide__table th,
          .size-guide__table td {
            padding: 8px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}
