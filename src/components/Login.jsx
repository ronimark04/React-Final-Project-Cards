import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../services/userService";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { SiteTheme } from "../App";
import "./style/Login.css";

function Login({ setUser }) {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().email().required().min(5),
            password: yup.string().required().min(7),
        }),
        onSubmit: values => {
            login(values)
                .then((response) => response.text())
                .then((token) => {
                    localStorage.setItem("token", token);
                    setUser(jwtDecode(token));
                    navigate("/home");
                    // ADD TOASTIFY HERE
                })
                .catch((error) => console.error(error));
        }
    });

    const themes = useContext(SiteTheme);

    return (
        <div className="login-container" style={{ color: themes.page.textColor }}>
            <h4 className="login-title">Login</h4>
            <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-input ${formik.touched.email && formik.errors.email ? "form-error" : ""}`}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="error-message">{formik.errors.email}</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-input ${formik.touched.password && formik.errors.password ? "form-error" : ""}`}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="error-message">{formik.errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn-dark"
                    style={{ backgroundColor: themes.navbar.bgColor }}
                    disabled={!formik.dirty || !formik.isValid}
                >
                    Login
                </button>

                <Link to="/register" className="login-link">
                    New User? Register Now
                </Link>
            </form>
        </div>
    );

}

export default Login;