const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
};

const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Định dạng số điện thoại 10 chữ số
    return phoneRegex.test(phone);
};

export { validateEmail, validatePhone };
