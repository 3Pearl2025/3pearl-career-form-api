import axios from "axios";

export const verifyCaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  const res = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );

  return res.data.success; // true or false
};
