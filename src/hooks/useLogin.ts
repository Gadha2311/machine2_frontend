import { message } from "antd";
import Axios from "../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { loginValues, useLoginreturn } from "../interface/userInterface";

const useLogin = (): useLoginreturn => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(false);
  const navigate = useNavigate();

  const validateLogin = (values: loginValues): boolean => {
    const regex = /^[^\s,]+$/;
    const { email, password } = values;

    if (!regex.test(email)) {
      setError("Email cannot contain spaces or commas.");
      return false;
    }

    if (!regex.test(password)) {
      setError("Password cannot contain spaces or commas.");
      return false;
    }
    setError(null);
    return true;
  };
  const loginUser = async (values: loginValues): Promise<void> => {
    if (!validateLogin(values)) {
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const response = await Axios.post(
        "/auth/login", 
        values
      );
      const data = response.data;
      if (response.status == 200) {
        message.success(data.message);
        console.log("hello");

        login(data.tocken, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message);
        message.error(data.message);
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      setError(error.response?.data?.message || "An error occurred");
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, loginUser };
};

export default useLogin;
