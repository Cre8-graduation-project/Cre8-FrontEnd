import { toast } from "react-toastify";

export const Toast = {
  success: (content, options) => {
    toast.success(content, {pauseOnHover: false, ...options})
  },
  error: (content, options) => {
    toast.error(content, {pauseOnHover: false, ...options})
  },
  registerSuccess: (content, options) => {
    toast.success(content, {pauseOnHover: false, position: "bottom-right", autoClose: 2000, ...options})
  },
  registerError: (content, options) => {
    toast.error(content, {pauseOnHover: false, position: "bottom-right", autoClose: 2000, ...options})
  },
  loginSuccess: (content, options) => {
    toast.success(content, {pauseOnHover: false, position: "bottom-right", autoClose: 2000, ...options})
  },
  loginError: (content, options) => {
    toast.error(content, {pauseOnHover: false, position: "bottom-right", autoClose: 2000, ...options})
  },
};