// import React, { useState, useEffect } from "react";
// import {
//   getReviewsByUser,
//   updateReview,
//   deleteReview,
//   getMovies,
// } from "../services/api";
// import { useAuth } from "../contexts/AuthContext";
// import { toast } from "react-toastify";
// import SimplePopup from "../components/SimplePopup";

// const AccountReviews = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingReview, setEditingReview] = useState(null);
//   const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
//   const [movies, setMovies] = useState([]);
//   const { user } = useAuth();
//   const [popup, setPopup] = useState(null);

//   useEffect(() => {
//     console.log("User from AuthContext:", user);
//     if (user?.MAKH || user?.makh || user?.id || user?.ma_kh) {
//       fetchUserReviews();
//       fetchMovies();
//     } else {
//       console.log("No valid user ID found");
//       setLoading(false);
//     }
//   }, [user]);

//   const fetchMovies = async () => {
//     try {
//       const movieList = await getMovies();
//       console.log("Movies from API:", movieList);
//       setMovies(Array.isArray(movieList) ? movieList : []);
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//       toast.error("Không thể tải danh sách phim");
//     }
//   };

//   const fetchUserReviews = async () => {
//     try {
//       const userId = user?.MAKH || user?.makh || user?.id || user?.ma_kh;
//       console.log("Fetching reviews for user ID:", userId);

//       if (!userId) {
//         toast.error("Không tìm thấy thông tin người dùng");
//         setLoading(false);
//         return;
//       }

//       const userReviews = await getReviewsByUser(userId);
//       console.log("Raw reviews from API:", userReviews);

//       let processedReviews = [];

//       if (Array.isArray(userReviews)) {
//         processedReviews = userReviews.map((review) => ({
//           MADG: review.MADG || review._id,
//           TENPHIM:
//             review.MAPHIM?.TENPHIM || review.TENPHIM || "Không rõ tên phim",
//           BINHLUAN: review.BINHLUAN || "",
//           SOSAO: review.SOSAO || 0,
//           NGAYDANHGIA: review.NGAYDANHGIA,
//           MAPHIM: review.MAPHIM?.MAPHIM || review.MAPHIM,
//           HINHANH: review.MAPHIM?.HINHANH || review.HINHANH || null,
//         }));
//       } else if (userReviews && typeof userReviews === "object") {
//         processedReviews = [
//           {
//             MADG: userReviews.MADG || userReviews._id,
//             TENPHIM:
//               userReviews.MAPHIM?.TENPHIM ||
//               userReviews.TENPHIM ||
//               "Không rõ tên phim",
//             BINHLUAN: userReviews.BINHLUAN || "",
//             SOSAO: userReviews.SOSAO || 0,
//             NGAYDANHGIA: userReviews.NGAYDANHGIA,
//             MAPHIM: userReviews.MAPHIM?.MAPHIM || userReviews.MAPHIM,
//             HINHANH: userReviews.MAPHIM?.HINHANH || userReviews.HINHANH || null,
//           },
//         ];
//       }

//       console.log("Processed reviews:", processedReviews);
//       setReviews(processedReviews);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//       toast.error("Không thể tải lịch sử đánh giá: " + error.message);
//       setReviews([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (review) => {
//     setEditingReview(review);
//     setEditForm({
//       rating: review.SOSAO || 5,
//       comment: review.BINHLUAN || "",
//     });
//   };

//   const handleSaveEdit = async () => {
//     console.log("handleSaveEdit triggered");
//     try {
//       const userId = user?.MAKH || user?.makh || user?.id || user?.ma_kh;
//       if (!userId) {
//         toast.error("Không tìm thấy thông tin người dùng");
//         return;
//       }

//       const payload = {
//         MAPHIM: editingReview.MAPHIM,
//         MAKH: userId,
//         SOSAO: Number(editForm.rating),
//         BINHLUAN: editForm.comment,
//       };
//       console.log("Payload gửi lên updateReview:", payload);

//       await updateReview(payload);
//       setPopup({
//         type: "success",
//         message: "Đã cập nhật đánh giá thành công!",
//       });

//       toast.success("Đã cập nhật đánh giá");
//       setEditingReview(null);
//       fetchUserReviews(); // Gọi lại để đồng bộ dữ liệu từ backend
//     } catch (error) {
//       console.error("Error updating review:", error);
//       toast.error("Không thể cập nhật đánh giá: " + error.message);
//     }
//   };

//   const handleDelete = async (review) => {
//     setPopup({
//       type: "confirm",
//       message: "Bạn có chắc muốn xóa đánh giá này?",
//       onConfirm: async () => {
//         try {
//           const userId = user?.MAKH || user?.makh || user?.id || user?.ma_kh;
//           if (!userId) {
//             toast.error("Không tìm thấy thông tin người dùng");
//             return;
//           }

//           const payload = {
//             MADG: review.MADG,
//             MAPHIM: review.MAPHIM,
//             MAKH: userId,
//           };
//           console.log("Payload gửi lên deleteReview:", payload);

//           await deleteReview(payload);
//           setPopup({
//             type: "success",
//             message: "Đã xóa đánh giá thành công!",
//           });
//           fetchUserReviews(); // Gọi lại để cập nhật danh sách
//         } catch (error) {
//           console.error("Error deleting review:", error);
//           toast.error("Không thể xóa đánh giá: " + error.message);
//         }
//       },
//     });
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now - date) / 1000);

//     if (diffInSeconds < 60) return "Vừa xong";
//     if (diffInSeconds < 3600)
//       return `${Math.floor(diffInSeconds / 60)} phút trước`;
//     if (diffInSeconds < 86400)
//       return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
//     if (diffInSeconds < 604800)
//       return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
//     return formatDate(dateString);
//   };

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">Lịch sử đánh giá của tôi</h2>
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-2 text-gray-600">Đang tải lịch sử đánh giá...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="max-w-6xl mx-auto p-4">
//         <h2 className="text-2xl font-bold mb-6">Lịch sử đánh giá của tôi</h2>
//         <div className="text-center py-8 text-gray-500">
//           Vui lòng đăng nhập để xem lịch sử đánh giá
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Lịch sử đánh giá của tôi</h2>

//       {reviews.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           Bạn chưa có đánh giá nào
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {reviews.map((review) => (
//             <div
//               key={review.MADG}
//               className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
//             >
//               <div className="flex gap-4">
//                 {/* Movie Image */}
//                 <div className="flex-shrink-0">
//                   <img
//                     src={
//                       review.HINHANH ||
//                       `https://via.placeholder.com/120x180?text=${encodeURIComponent(
//                         review.TENPHIM
//                       )}`
//                     }
//                     alt={review.TENPHIM}
//                     className="w-32 h-48 object-cover rounded-md shadow-sm"
//                     onError={(e) => {
//                       e.target.src = `https://via.placeholder.com/120x180?text=Phim`;
//                     }}
//                   />
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-xl text-gray-800 mb-1">
//                         {review.TENPHIM}
//                       </h3>

//                       {/* Review Time */}
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-xs text-gray-500">
//                           {formatTimeAgo(review.NGAYDANHGIA)}
//                         </span>
//                         <span className="text-xs text-gray-400">•</span>
//                         <span className="text-xs text-gray-500">
//                           {formatDate(review.NGAYDANHGIA)}
//                         </span>
//                       </div>

//                       {/* Rating */}
//                       <div className="flex items-center mb-3">
//                         {[...Array(5)].map((_, i) => (
//                           <span
//                             key={i}
//                             className={`text-xl ${
//                               i < review.SOSAO
//                                 ? "text-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                           >
//                             ★
//                           </span>
//                         ))}
//                         <span className="ml-2 text-sm font-medium text-gray-700">
//                           {review.SOSAO}/5 sao
//                         </span>
//                       </div>

//                       {/* Review Content */}
//                       <div className="bg-gray-50 p-3 rounded-md">
//                         <p className="text-gray-700 leading-relaxed">
//                           {review.BINHLUAN}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col space-y-2 ml-4">
//                       <button
//                         onClick={() => handleEdit(review)}
//                         className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
//                         title="Chỉnh sửa đánh giá"
//                       >
//                         Sửa
//                       </button>
//                       <button
//                         onClick={() => handleDelete(review)}
//                         className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
//                         title="Xóa đánh giá"
//                       >
//                         Xóa
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {editingReview?.MADG === review.MADG && (
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//                   <h4 className="font-semibold mb-3 text-gray-800">
//                     Chỉnh sửa đánh giá
//                   </h4>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Đánh giá sao
//                       </label>
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <span
//                             key={star}
//                             onClick={() =>
//                               setEditForm({ ...editForm, rating: star })
//                             }
//                             className={`cursor-pointer text-2xl transition-colors ${
//                               star <= editForm.rating
//                                 ? "text-yellow-500"
//                                 : "text-gray-300 hover:text-yellow-400"
//                             }`}
//                           >
//                             ★
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Nhận xét
//                       </label>
//                       <textarea
//                         value={editForm.comment}
//                         onChange={(e) =>
//                           setEditForm({ ...editForm, comment: e.target.value })
//                         }
//                         placeholder="Viết nhận xét của bạn..."
//                         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         rows="4"
//                       />
//                     </div>
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={handleSaveEdit}
//                         className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                       >
//                         Lưu thay đổi
//                       </button>
//                       <button
//                         onClick={() => setEditingReview(null)}
//                         className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
//                       >
//                         Hủy
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       {popup && (
//         <SimplePopup
//           message={popup.message}
//           onClose={() => setPopup(null)}
//           onConfirm={popup.onConfirm}
//           confirmText={popup.type === "confirm" ? "Xóa" : "OK"}
//           cancelText="Hủy"
//         />
//       )}
//     </div>
//   );
// };

// export default AccountReviews;
