
/**
 * 
 * @param {*} expireTime 
 * @returns {otp , otpExpire}
 */
export  function generateOtp(expireTime = 15 * 60 * 1000) {
  const otp = Math.floor(Math.random() * 90000 + 10000);
  const otpExpire = new Date(Date.now() + expireTime);
  return {otp,otpExpire};
} 