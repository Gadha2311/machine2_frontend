import Axios from "../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signUpvalues, useSignUpReturn } from "../interface/userInterface";


const useSignUp = (): useSignUpReturn => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const registerUser = async (values: signUpvalues): Promise<void> => {
    const { username, email, password, confirmPassword } = values;
    const regex = /^[^\s,]+$/;
    console.log("heloooo");

    if (password !== confirmPassword) {
      setError("password doesn't match");
      return;
    }
    if (!regex.test(username)) {
      console.log("usname");

      setError("Username cannot contain spaces or commas.");
      return;
    }
    if (!regex.test(email)) {
      console.log("email");

      setError("Email cannot contain spaces or commas.");
      return;
    }
    if (!regex.test(password)) {
      setError("Password cannot contain spaces or commas");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const res = await Axios.post(
        "/auth/signup", 
        values
      );
      const data = res.data;
      if (res.status === 201) {
        Swal.fire({
          text: "Account Created Successfully",
          timer: 3000,
          icon: "success",
          showConfirmButton: true,
        });
        navigate("/");
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        setError("Registration failed");
      }
    } catch(error:any) {
      setError(error.response?.data?.message );
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    registerUser,
  };
};
export default useSignUp;
