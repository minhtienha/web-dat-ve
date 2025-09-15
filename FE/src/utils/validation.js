// Validation utilities cho tất cả input forms

export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Email không hợp lệ",
    required: true,
  },
  password: {
    pattern: /^.{6,}$/,
    message: "Mật khẩu cần ít nhất 6 ký tự",
    minLength: 6,
    required: true,
  },
  phone: {
    pattern: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
    message: "Số điện thoại không hợp lệ (VD: 0987654321)",
    required: true,
  },
  name: {
    pattern:
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
    message: "Tên không được chứa ký tự đặc biệt",
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  date: {
    validate: (value) => new Date(value) >= new Date(),
    message: "Ngày không được nhỏ hơn hiện tại",
    required: true,
  },
  number: {
    validate: (value) => !isNaN(value) && Number(value) > 0,
    message: "Vui lòng nhập số dương",
    required: true,
  },
  text: {
    minLength: 1,
    maxLength: 500,
    message: "Vui lòng nhập từ 1-500 ký tự",
    required: true,
  },
};

export const validateInput = (name, value) => {
  const rule = validationRules[name];
  if (!rule) return { isValid: true, message: "" };

  // Required check
  if (rule.required && (!value || value.trim() === "")) {
    return { isValid: false, message: "Trường này là bắt buộc" };
  }

  // Pattern check
  if (rule.pattern && !rule.pattern.test(value)) {
    return { isValid: false, message: rule.message };
  }

  // Length check
  if (rule.minLength && value.length < rule.minLength) {
    return { isValid: false, message: `Cần ít nhất ${rule.minLength} ký tự` };
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    return {
      isValid: false,
      message: `Không được vượt quá ${rule.maxLength} ký tự`,
    };
  }

  // Custom validation
  if (rule.validate && !rule.validate(value)) {
    return { isValid: false, message: rule.message };
  }

  return { isValid: true, message: "" };
};

export const validateForm = (formData) => {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach((key) => {
    const result = validateInput(key, formData[key]);
    if (!result.isValid) {
      errors[key] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};
