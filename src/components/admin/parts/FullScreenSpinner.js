const FullScreenSpinner = ({ isLoading }) => {
  return (
    isLoading && (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(67, 89, 113, 0.8)",
          zIndex: 10000,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            borderStyle: "solid",
            borderWidth: "8px",
            borderTopColor: "#6610f2", // Màu cho phần trên
            borderRightColor: "#71dd37", // Màu cho phần bên phải
            borderBottomColor: "#ffab00", // Màu cho phần dưới
            borderLeftColor: "#233446", // Màu cho phần bên trái
            animation: "spin 1s linear infinite", // Quay tròn spinner
          }}
        ></div>

        {/* Inline CSS for animation */}
        <style>
          {`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    )
  );
};

export default FullScreenSpinner;
