import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { getUserById, updateUser } from "../services/userService";
import userValidationSchema from "../../customHooks/userValidationSchema";

function Profile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUserById(jwtDecode(localStorage.getItem("token"))._id)
                .then((res) => { setUser(res.data); setIsLoading(false); })
                .catch((err) => { console.error(err); setIsLoading(false); });
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            name: { first: "", middle: "", last: "" },
            phone: "",
            image: { url: "", alt: "" },
            address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" }
        },
        enableReinitialize: true,
        validationSchema: yup.object(userValidationSchema),
        onSubmit: values => {
            updateUser(user._id, values)
                .then((res) => {
                    setUser(res.data);
                    alert(`${user.name.first} ${user.name.last} has been updated successfully`);
                })
                .catch(err => console.error(err));
        }
    });

    useEffect(() => {
        if (user) {
            const initialValues = {
                name: { first: user.name.first, middle: user.name.middle, last: user.name.last },
                phone: user.phone,
                image: { url: user.image.url, alt: user.image.alt },
                address: { state: user.address.state, country: user.address.country, city: user.address.city, street: user.address.street, houseNumber: user.address.houseNumber, zip: user.address.zip }
            };
            if (initialValues.address.state === "not defined") { // this just wouldn't work any other way
                initialValues.address.state = "";
            }
            formik.setValues(initialValues);
        }
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (<><div className="container">
        <h4 className="display-4 my-2">Profile</h4>
        <form onSubmit={formik.handleSubmit}>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="name.first"
                        placeholder="First Name"
                        value={formik.values.name.first}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="name.first">First Name</label>
                    {formik.touched.name?.first && formik.errors.name?.first && (
                        <p className="text-danger">{formik.errors.name.first}</p>
                    )}
                </div>
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="name.middle"
                        placeholder="Middle Name (Optional)"
                        value={formik.values.name.middle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="name.middle">Middle Name</label>
                    {formik.touched.name?.middle && formik.errors.name?.middle && (
                        <p className="text-danger">{formik.errors.name.middle}</p>
                    )}
                </div>
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="name.last"
                        placeholder="Last Name"
                        value={formik.values.name.last}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="name.last">Last Name</label>
                    {formik.touched.name?.last && formik.errors.name?.last && (
                        <p className="text-danger">{formik.errors.name.last}</p>
                    )}
                </div>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                <label htmlFor="phone">Phone Number</label>
                {formik.touched.phone && formik.errors.phone && (
                    <p className="text-danger">{formik.errors.phone}</p>
                )}
            </div>
            <div className="form-floating mb-3">
                <input
                    type="url"
                    className="form-control"
                    id="image.url"
                    placeholder="Profile Image URL"
                    value={formik.values.image.url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                <label htmlFor="image.url">Profile Image URL</label>
                {formik.touched.image?.url && formik.errors.image?.url && (
                    <p className="text-danger">{formik.errors.image.url}</p>
                )}
            </div>
            <div className="form-floating mb-3">
                <input
                    type="text"
                    className="form-control"
                    id="image.alt"
                    placeholder="Image Description"
                    value={formik.values.image.alt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                <label htmlFor="image.alt">Image Description</label>
                {formik.touched.image?.alt && formik.errors.image?.alt && (
                    <p className="text-danger">{formik.errors.image.alt}</p>
                )}
            </div>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="address.state"
                        placeholder="State"
                        value={formik.values.address.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.state">State</label>
                    {formik.touched.address?.state && formik.errors.address?.state && (
                        <p className="text-danger">{formik.errors.address.state}</p>
                    )}
                </div>
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="address.country"
                        placeholder="Country"
                        value={formik.values.address.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.country">Country</label>
                    {formik.touched.address?.country && formik.errors.address?.country && (
                        <p className="text-danger">{formik.errors.address.country}</p>
                    )}
                </div>
                <div className="col-md-4 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="address.city"
                        placeholder="City"
                        value={formik.values.address.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.city">City</label>
                    {formik.touched.address?.city && formik.errors.address?.city && (
                        <p className="text-danger">{formik.errors.address.city}</p>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="address.street"
                        placeholder="Street"
                        value={formik.values.address.street}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.street">Street</label>
                    {formik.touched.address?.street && formik.errors.address?.street && (
                        <p className="text-danger">{formik.errors.address.street}</p>
                    )}
                </div>
                <div className="col-md-3 mb-3">
                    <input
                        type="number"
                        className="form-control"
                        id="address.houseNumber"
                        placeholder="House Number"
                        value={formik.values.address.houseNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.houseNumber">House Number</label>
                    {formik.touched.address?.houseNumber && formik.errors.address?.houseNumber && (
                        <p className="text-danger">{formik.errors.address.houseNumber}</p>
                    )}
                </div>
                <div className="col-md-3 mb-3">
                    <input
                        type="number"
                        className="form-control"
                        id="address.zip"
                        placeholder="ZIP Code"
                        value={formik.values.address.zip}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    <label htmlFor="address.zip">ZIP Code</label>
                    {formik.touched.address?.zip && formik.errors.address?.zip && (
                        <p className="text-danger">{formik.errors.address.zip}</p>
                    )}
                </div>
            </div>
            <button
                type="submit"
                className="btn btn-primary mb-3"
                disabled={!formik.dirty || !Object.keys(formik.touched).length || !formik.isValid}>
                Update Details
            </button>
        </form>
    </div>
    </>
    );
}

export default Profile;