function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
    return otp;
}

module.exports = generateOTP;