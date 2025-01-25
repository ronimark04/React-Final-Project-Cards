import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { login, register } from "../services/userService";
import { userValidationSchemaForRegister } from "../../customHooks/userValidationSchema";
import { SiteTheme } from "../App";
import { useContext } from "react";
import "./style/Profile.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Register({ setUser }) {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: { first: "", middle: "", last: "" },
            phone: "",
            email: "",
            password: "",
            image: { url: "", alt: "" },
            address: { state: "", country: "", city: "", street: "", houseNumber: 0, zip: 0 },
            isBusiness: false,
        },
        validationSchema: yup.object(userValidationSchemaForRegister),
        onSubmit: values => {
            register(values)
                .then(response => {
                    login(values)
                        .then((response) => response.text())
                        .then((token) => {
                            localStorage.setItem("token", token);
                            setUser(jwtDecode(token));
                            navigate("/home");
                            toast(`Welcome ${values.name.first}!`);
                        })
                        .catch((error) => console.error(error));
                }).catch(err => {
                    if (err.response && err.response.data === "User already registered") {
                        toast.error("User already registered, please log in");
                    } else { console.error(err); }
                });
        }
    });

    const themes = useContext(SiteTheme);

    return (
        <div className="profile-container" style={{ color: themes.page.textColor }}>
            <h4 className="profile-title">Register</h4>
            <form onSubmit={formik.handleSubmit} className="profile-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name.first">First Name</label>
                        <input
                            type="text"
                            id="name.first"
                            value={formik.values.name.first}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.name?.first && formik.errors.name?.first ? "form-error" : ""}`}
                        />
                        {formik.touched.name?.first && formik.errors.name?.first && (
                            <p className="error-message">{formik.errors.name.first}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name.middle">Middle Name (Optional)</label>
                        <input
                            type="text"
                            id="name.middle"
                            value={formik.values.name.middle}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name.last">Last Name</label>
                        <input
                            type="text"
                            id="name.last"
                            value={formik.values.name.last}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.name?.last && formik.errors.name?.last ? "form-error" : ""}`}
                        />
                        {formik.touched.name?.last && formik.errors.name?.last && (
                            <p className="error-message">{formik.errors.name.last}</p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-input ${formik.touched.phone && formik.errors.phone ? "form-error" : ""}`}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="error-message">{formik.errors.phone}</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
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
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-input ${formik.touched.password && formik.errors.password ? "form-error" : ""}`}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="error-message">{formik.errors.password}</p>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="image.url">Profile Image URL</label>
                        <input
                            type="url"
                            id="image.url"
                            value={formik.values.image.url}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image.alt">Image Description</label>
                        <input
                            type="text"
                            id="image.alt"
                            value={formik.values.image.alt}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="address.state">State</label>
                        <input
                            type="text"
                            id="address.state"
                            value={formik.values.address.state}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.country">Country</label>
                        <input
                            type="text"
                            id="address.country"
                            value={formik.values.address.country}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.address?.country && formik.errors.address?.country ? "form-error" : ""}`}
                        />
                        {formik.touched.address?.country && formik.errors.address?.country && (
                            <p className="error-message">{formik.errors.address.country}</p>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="address.city">City</label>
                        <input
                            type="text"
                            id="address.city"
                            value={formik.values.address.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.address?.city && formik.errors.address?.city ? "form-error" : ""}`}
                        />
                        {formik.touched.address?.city && formik.errors.address?.city && (
                            <p className="error-message">{formik.errors.address.city}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.street">Street</label>
                        <input
                            type="text"
                            id="address.street"
                            value={formik.values.address.street}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.address?.street && formik.errors.address?.street ? "form-error" : ""}`}
                        />
                        {formik.touched.address?.street && formik.errors.address?.street && (
                            <p className="error-message">{formik.errors.address.street}</p>
                        )}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="address.houseNumber">House Number</label>
                        <input
                            type="number"
                            id="address.houseNumber"
                            value={formik.values.address.houseNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`form-input ${formik.touched.address?.houseNumber && formik.errors.address?.houseNumber ? "form-error" : ""}`}
                        />
                        {formik.touched.address?.houseNumber && formik.errors.address?.houseNumber && (
                            <p className="error-message">{formik.errors.address.houseNumber}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="address.zip">ZIP Code</label>
                        <input
                            type="number"
                            id="address.zip"
                            value={formik.values.address.zip}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="button-and-checkbox-container-register">
                    <div>
                        <input
                            type="checkbox"
                            id="isBusiness"
                            checked={formik.values.isBusiness}
                            onChange={formik.handleChange}
                            className="form-checkbox"
                        />
                        <label htmlFor="isBusiness">Register as a Business Account</label>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-dark-register"
                        style={{ backgroundColor: themes.navbar.bgColor, color: themes.navbar.textColor }}
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Register
                    </button>
                </div>
                <div className="login-link">
                    <Link to="/login">Already have an account? Log in here</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;