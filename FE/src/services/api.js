import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Centralized error handler
const handleError = (error, customMessage = "API Error") => {
  console.error(`${customMessage}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || error.message);
};

// Centralized request handler
const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${url}`,
      ...(data && { data }),
      ...(params && { params }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    handleError(error, `Error calling ${method.toUpperCase()} ${url}`);
  }
};

// ==================== AUTHENTICATION ====================
export const register = async (userData) => {
  return apiRequest("POST", "/nguoidung/dang-ky", userData);
};

export const login = async (userData) => {
  return apiRequest("POST", "/nguoidung/dang-nhap", userData);
};

// ==================== USER MANAGEMENT ====================
export const getUserById = async (makh) => {
  return apiRequest("GET", `/nguoidung/chi-tiet/${makh}`);
};

export const updateUser = async (makh, payload) => {
  return apiRequest("PUT", `/nguoidung/cap-nhat/${makh}`, payload);
};

export const checkPhone = async (phone) => {
  return apiRequest("GET", "/checkPhone", null, { phone });
};

// ==================== MOVIES ====================
export const getMovies = async () => {
  return apiRequest("GET", "/phim/danh-sach");
};

export const getFeaturedMovies = async () => {
  return apiRequest("GET", "/phim/danh-sach");
};

export const getNowShowingMovies = async () => {
  return apiRequest("GET", "/phim/danh-sach-dang-chieu");
};

export const getUpcomingMovies = async () => {
  return apiRequest("GET", "/phim/danh-sach-sap-chieu");
};

export const searchMovies = (tenPhim) => {
  return apiRequest("GET", "/phim/tim-kiem", null, { tenPhim });
};

// ==================== MOVIE DETAILS ====================
export const getMovieById = async (id) => {
  return apiRequest("GET", `/phim/chi-tiet/${id}`);
};

export const getReviewsByMovie = async (maphim) => {
  return apiRequest("GET", `/danhgia/theo-phim/${maphim}`);
};

export const upsertReview = async ({ MAPHIM, MAKH, SOSAO, BINHLUAN }) => {
  return apiRequest("POST", "/danhgia/them", {
    MAPHIM,
    MAKH,
    SOSAO,
    BINHLUAN,
  });
};

export const deleteReview = async ({ MADG, MAPHIM, MAKH }) => {
  const params = new URLSearchParams();
  if (MADG) params.append("madg", MADG);
  if (MAPHIM) params.append("maphim", MAPHIM);
  if (MAKH) params.append("makh", MAKH);

  return apiRequest("DELETE", `/danhgia/xoa?${params.toString()}`);
};

export const updateReview = async ({ MAPHIM, MAKH, SOSAO, BINHLUAN }) => {
  return apiRequest("PUT", "/danhgia/cap-nhat", {
    MAPHIM,
    MAKH,
    SOSAO,
    BINHLUAN,
  });
};

export const getReviewsByUser = async (makh) => {
  return apiRequest("GET", `/danhgia/theo-nguoi-dung/${makh}`);
};

// ==================== SHOWTIMES & BOOKING ====================
export const getShowtimesByMovie = (movieId) => {
  return apiRequest("GET", `/chitietsuatchieu/theo-phim/${movieId}`);
};

export const getShowtimeDetail = (maSuat) => {
  return apiRequest("GET", `/suatchieu/chi-tiet/${maSuat}`);
};

export const getRoomDetail = (maPhong) => {
  return apiRequest("GET", `/phongchieu/chi-tiet/${maPhong}`);
};

export const getTheaterDetail = (maRap) => {
  return apiRequest("GET", `/rapchieu/chi-tiet/${maRap}`);
};

// ==================== TICKETS ====================
export const createTicket = async (ticketData) => {
  return apiRequest("POST", "/ve/dat-ve", ticketData);
};

export const CheckTicketBooked = async (makh) => {
  return apiRequest("GET", `/ve/lay-ve-theo-makh/${makh}`);
};

// ==================== THEATERS ====================
export const getTheaters = async () => {
  return apiRequest("GET", "/rapchieu/danh-sach");
};

export const getTheaterById = async (id) => {
  return apiRequest("GET", `/rapchieu/chi-tiet/${id}`);
};

export const getMaPhongChieu = async (
  movieTitle,
  ngayChieu,
  tinhThanh,
  tenRap,
  gioBatDau
) => {
  return apiRequest("GET", "/maphong", null, {
    tenphim: movieTitle,
    ngaychieu: ngayChieu,
    tinhthanh: tinhThanh,
    tenrap: tenRap,
    giobatdau: gioBatDau,
  });
};
