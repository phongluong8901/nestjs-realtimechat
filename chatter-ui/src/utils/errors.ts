const formatErrorMessage = (errorMessage: string) => {
  if (!errorMessage) return "";
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
};

const extracErrorMessage = (err: any): string => {
  // 1. Lấy message từ NestJS Validation hoặc GraphQL Error
  const rawMessage =
    err?.graphQLErrors?.[0]?.extensions?.originalError?.message ||
    err?.graphQLErrors?.[0]?.message;

  let finalMessage = "";

  // 2. Xử lý nếu là mảng hoặc chuỗi
  if (Array.isArray(rawMessage)) {
    finalMessage = rawMessage[0];
  } else if (typeof rawMessage === "string") {
    finalMessage = rawMessage;
  }
  // 3. Xử lý lỗi mạng
  else if (err?.networkError) {
    finalMessage = "Kết nối đến server thất bại. Vui lòng kiểm tra mạng.";
  }
  // 4. Lỗi mặc định của Apollo/Generic
  else {
    finalMessage = err?.message || "Đã xảy ra lỗi không xác định.";
  }

  // Trả về kết quả đã được format viết hoa chữ cái đầu
  return formatErrorMessage(finalMessage);
};

export { extracErrorMessage };
