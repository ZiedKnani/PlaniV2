import * as Yup from "yup";

export const validationLoginForm = () =>
  Yup.object({
    email: Yup.string().email().required("please validate your email!"),
    // userName:Yup.string().required("please enter your name and last name"),
    password: Yup.string()
      .min(8)
      .required("password should be at least 8 character"),
  });
export const validationRegisterForm = () =>
  Yup.object({
    email: Yup.string()
      .email()
      .required("please validate your email!")
      .matches(
        /@(msb|medtech)\.tn$/,
        "Email must end with @msb.tn or @medtech.tn"
      ),
    userName: Yup.string().required("please enter your name and last name"),
    password: Yup.string()
      .min(8)
      .required("password should be at least 8 character"),
  });
