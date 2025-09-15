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
      // Removed responseType: "text" to let axios handle JSON parsing automatically
    };

    const response = await axios(config);
    // Axios automatically parses JSON response
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
export const getUsers = async () => {
  return apiRequest("GET", "/nguoidung/danh-sach");
};

export const addUser = async (userData) => {
  return apiRequest("POST", "/nguoidung/them", userData);
};

export const deleteUser = async (id) => {
  return apiRequest("DELETE", `/nguoidung/xoa/${id}`);
};

export const updatePasswordByEmail = async (payload) => {
  return apiRequest("PUT", "/nguoidung/cap-nhat-mat-khau", payload);
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

export const addMovie = async (movieData) => {
  return apiRequest("POST", "/phim/them-phim", movieData);
};

export const updateMovie = async (maphim, movieData) => {
  return apiRequest("PUT", `/phim/cap-nhat/${maphim}`, movieData);
};

export const deleteMovie = async (maphim) => {
  return apiRequest("DELETE", `/phim/xoa-phim/${maphim}`);
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
// New merged endpoints - replaces both /suatchieu and /chitietsuatchieu
export const getShowtimesByMovie = (movieId) => {
  return apiRequest("GET", `/suatchieu/theo-phim/${movieId}`);
};

export const getShowtimeDetail = (maSuat) => {
  return apiRequest("GET", `/suatchieu/chi-tiet/${maSuat}`);
};

export const getShows = async () => {
  return apiRequest("GET", "/suatchieu/danh-sach");
};

export const getShowDetails = async (masuat) => {
  return apiRequest("GET", `/suatchieu/chi-tiet/${masuat}`);
};

export const addShow = async (showData) => {
  return apiRequest("POST", "/suatchieu/them-suat-chieu", showData);
};

export const updateShow = async (masuat, showData) => {
  return apiRequest("PUT", `/suatchieu/cap-nhat/${masuat}`, showData);
};

export const deleteShow = async (masuat) => {
  return apiRequest("DELETE", `/suatchieu/xoa-suat-chieu/${masuat}`);
};

export const getAllShowDetails = async () => {
  return apiRequest("GET", "/suatchieu/day-du");
};

// Note: The following functions are no longer needed as the functionality is now merged
// into the main showtime operations. All showtime details are now part of the showtime object.

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

export const getAllTickets = async () => {
  return apiRequest("GET", "/ve/danh-sach");
};

export const getMoviesForFilter = async () => {
  return apiRequest("GET", "/phim/danh-sach");
};

export const getTheatersForFilter = async () => {
  return apiRequest("GET", "/rapchieu/danh-sach");
};

// ==================== THEATERS ====================
export const getTheaters = async () => {
  return apiRequest("GET", "/rapchieu/danh-sach");
};

export const getTheaterByMarap = async (marap) => {
  return apiRequest("GET", `/rapchieu/chi-tiet/${marap}`);
};

export const addTheater = async (theaterData) => {
  return apiRequest("POST", "/rapchieu/them-rap", theaterData);
};

export const updateTheater = async (marap, theaterData) => {
  return apiRequest("PUT", `/rapchieu/cap-nhat/${marap}`, theaterData);
};

export const deleteTheater = async (marap) => {
  return apiRequest("DELETE", `/rapchieu/xoa-rap/${marap}`);
};

// ==================== ROOMS ====================
export const getRoomsByTheater = async (marap) => {
  return apiRequest("GET", `/phongchieu/danh-sach-theo-rap/${marap}`);
};

export const addRoom = async (roomData) => {
  return apiRequest("POST", "/phongchieu/them-phong-chieu", roomData);
};

export const updateRoom = async (maphong, roomData) => {
  return apiRequest("PUT", `/phongchieu/cap-nhat/${maphong}`, roomData);
};

export const deleteRoom = async (maphong) => {
  return apiRequest("DELETE", `/phongchieu/xoa-phong-chieu/${maphong}`);
};
