export const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);

    // Lấy các thành phần của ngày và giờ
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Định dạng số với hai chữ số
    const pad = (num: number) => num.toString().padStart(2, "0");

    // Tùy chỉnh định dạng
    return `${pad(day)}/${pad(month)}/${year}, ${pad(hours)}:${pad(minutes)}`;
};

