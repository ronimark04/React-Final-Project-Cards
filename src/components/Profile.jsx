import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { getUserById, updateUser, patchIsBusiness } from "../services/userService";
import userValidationSchema from "../../customHooks/userValidationSchema";
import "./style/Profile.css";
import { SiteTheme } from "../App";
import { toast } from "react-toastify";

function Profile({ setUser }) {
    const [localUser, setLocalUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUserById(jwtDecode(localStorage.getItem("token"))._id)
                .then((res) => { setLocalUser(res.data) })
                .catch((err) => { console.error(err) })
                .finally(() => { setIsLoading(false); });
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            name: { first: "", middle: "", last: "" },
            phone: "",
            image: { url: "", alt: "" },
            address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
            isBusiness: false
        },
        enableReinitialize: true,
        validationSchema: yup.object(userValidationSchema),
        onSubmit: values => {
            const { isBusiness, ...rest } = values;
            updateUser(localUser._id, rest)
                .then((res) => {
                    if (isBusiness !== localUser.isBusiness) {
                        patchIsBusiness(localUser._id)
                            .then((res) => {
                                setLocalUser(res.data);
                                setUser(res.data); // to make navbar re-render if user's business status changes
                                toast.success("Your profile has been updated successfully");
                            })
                            .catch((err) => { console.error(err); });
                    } else {
                        setLocalUser(res.data);
                        toast.success("Your profile has been updated successfully");
                    }
                })
                .catch(err => console.error(err));
        }
    });

    useEffect(() => {
        if (localUser) {
            const initialValues = {
                name: { first: localUser.name.first, middle: localUser.name.middle, last: localUser.name.last },
                phone: localUser.phone,
                image: { url: localUser.image.url, alt: localUser.image.alt },
                address: { state: localUser.address.state, country: localUser.address.country, city: localUser.address.city, street: localUser.address.street, houseNumber: localUser.address.houseNumber, zip: localUser.address.zip },
                isBusiness: localUser.isBusiness
            };
            if (initialValues.address.state === "not defined") { // this just wouldn't work any other way...
                initialValues.address.state = "";
            }
            formik.setValues(initialValues);
        }
    }, [localUser]);

    const themes = useContext(SiteTheme);

    return (
        <div className="profile-container" style={{ color: themes.page.textColor }}>
            <h4 className="profile-title">Profile</h4>
            {isLoading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit} className="profile-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name.first">First Name *</label>
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
                            <label htmlFor="name.middle">Middle Name</label>
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
                            <label htmlFor="name.last">Last Name *</label>
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

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Phone *</label>
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
                            <label htmlFor="image.url">Image URL</label>
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
                            <label htmlFor="address.country">Country *</label>
                            <input
                                type="text"
                                id="address.country"
                                value={formik.values.address.country}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address.city">City *</label>
                            <input
                                type="text"
                                id="address.city"
                                value={formik.values.address.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="address.street">Street *</label>
                            <input
                                type="text"
                                id="address.street"
                                value={formik.values.address.street}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address.houseNumber">House Number *</label>
                            <input
                                type="number"
                                id="address.houseNumber"
                                value={formik.values.address.houseNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-input"
                            />
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
                            <label htmlFor="isBusiness">Business Account?</label>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-dark-register"
                            style={{ backgroundColor: themes.navbar.bgColor, color: themes.navbar.textColor }}
                            disabled={!formik.dirty || (!Object.keys(formik.touched).length && formik.values.isBusiness === localUser.isBusiness) || !formik.isValid}
                        >
                            Update Details
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Profile;