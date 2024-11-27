export const formatCurrency = (amount) => {
    if (isNaN(amount)) return "0"; // Trả về 0 nếu không phải số
    return parseInt(amount, 10).toLocaleString("vi-VN", {
        minimumFractionDigits: 0, // Không hiển thị phần thập phân
        maximumFractionDigits: 0,
    });
};
