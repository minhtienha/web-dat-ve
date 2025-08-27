// SimplePopup.js
import React from "react";

const SimplePopup = ({
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText, // không set mặc định "Hủy" nữa
  type = "info", // thêm type
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          {type === "confirm" ? (
            <>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                {cancelText || "Hủy"}
              </button>
            </>
          ) : (
            <button
              onClick={onConfirm || onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplePopup;
