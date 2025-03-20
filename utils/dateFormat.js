const convertTimestampToDateTime = (timestamp) => {
    const date = new Date(timestamp);

    // ดึงข้อมูล วัน, เดือน, ปี, ชั่วโมง, นาที
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const convertTimestampToThaiDateTime = (timestamp) => {
    const date = new Date(timestamp);

    // ดึงข้อมูล วัน, เดือน, ปี, ชั่วโมง, นาที
    const day = String(date.getDate()).padStart(2, '0');
    const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const monthThai = monthsThai[date.getMonth()];
    const yearThai = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${monthThai} ${yearThai} ${hours}:${minutes}`;
};

module.exports = { convertTimestampToDateTime, convertTimestampToThaiDateTime };