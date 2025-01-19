import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login } from "../services/userService";
import { jwtDecode } from "jwt-decode";

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

    return (<>
        <div className="container">
            <h4 className="display-4 my=2">Login</h4>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="floatingInput">Email address</label>
                    {formik.touched.email && formik.errors.email && (<p className="text-danger">{formik.errors.email}</p>)}
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="floatingInput">Password</label>
                    {formik.touched.password && formik.errors.password && (<p className="text-danger">{formik.errors.password}</p>)}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={!formik.dirty || !formik.isValid}>Login</button>
                <Link to="/register" className="btn btn-link">New User? Register Now</Link>
            </form>
        </div>
    </>);
}

export default Login;