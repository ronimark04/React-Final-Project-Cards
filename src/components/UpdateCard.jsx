import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { getCardById, updateCard } from "../services/cardsService";

const UpdateCard = forwardRef(({ cardId, onHide, requestRender }, ref) => {
    const [card, setCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cardId) {
            getCardById(cardId)
                .then((res) => {
                    setCard(res.data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [cardId]);

    const formik = useFormik({
        initialValues: {
            title: "",
            subtitle: "",
            description: "",
            phone: "",
            email: "",
            web: "",
            image: { url: "", alt: "" },
            address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().required().min(2).max(256),
            subtitle: yup.string().min(2).max(256).required(),
            description: yup.string().min(2).max(1024).required(),
            phone: yup.string().required().matches(/^05[0-9]{1}-?[0-9]{7}$/).min(9).max(11),
            email: yup.string().email().required().min(5),
            web: yup.string().url().min(14),
            image: yup.object({
                url: yup.string().url().min(14),
                alt: yup.string().min(2).max(256),
            }),
            address: yup.object({
                state: yup.string().min(2).max(256),
                country: yup.string().required().min(2).max(256),
                city: yup.string().required().min(2).max(256),
                street: yup.string().required().min(2).max(256),
                houseNumber: yup.number().required().min(1),
                zip: yup.number().required().min(1),
            }).required(),
        }),
        onSubmit: (values) => {
            updateCard(cardId, values)
                .then((res) => {
                    onHide();
                    requestRender();
                    alert(`${values.title} has been updated successfully`);
                })
                .catch(err => console.error(err));
        },
    });

    useImperativeHandle(ref, () => ({
        submitForm: formik.submitForm,
    }));

    useEffect(() => {
        if (card) {
            formik.setValues({
                title: card.title,
                subtitle: card.subtitle,
                description: card.description,
                phone: card.phone,
                email: card.email,
                web: card.web,
                image: { url: card.image.url, alt: card.image.alt },
                address: {
                    state: card.address.state,
                    country: card.address.country,
                    city: card.address.city,
                    street: card.address.street,
                    houseNumber: card.address.houseNumber,
                    zip: card.address.zip,
                },
            });
        }
    }, [card]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                        />
                        {formik.errors.title ? <div className="text-danger">{formik.errors.title}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="subtitle">Subtitle</label>
                        <input
                            id="subtitle"
                            name="subtitle"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.subtitle}
                        />
                        {formik.errors.subtitle ? <div className="text-danger">{formik.errors.subtitle}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-3">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                        {formik.errors.description ? <div className="text-danger">{formik.errors.description}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.phone}
                        />
                        {formik.errors.phone ? <div className="text-danger">{formik.errors.phone}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                        {formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="web">Web</label>
                        <input
                            id="web"
                            name="web"
                            type="url"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.web}
                        />
                        {formik.errors.web ? <div className="text-danger">{formik.errors.web}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="image.url">Image URL</label>
                        <input
                            id="image.url"
                            name="image.url"
                            type="url"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.image.url}
                        />
                        {formik.errors.image?.url ? <div className="text-danger">{formik.errors.image.url}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-3">
                        <label htmlFor="image.alt">Image Alt</label>
                        <input
                            id="image.alt"
                            name="image.alt"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.image.alt}
                        />
                        {formik.errors.image?.alt ? <div className="text-danger">{formik.errors.image.alt}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.state">State</label>
                        <input
                            id="address.state"
                            name="address.state"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.state}
                        />
                        {formik.errors.address?.state ? <div className="text-danger">{formik.errors.address.state}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.country">Country</label>
                        <input
                            id="address.country"
                            name="address.country"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.country}
                        />
                        {formik.errors.address?.country ? <div className="text-danger">{formik.errors.address.country}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.city">City</label>
                        <input
                            id="address.city"
                            name="address.city"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.city}
                        />
                        {formik.errors.address?.city ? <div className="text-danger">{formik.errors.address.city}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.street">Street</label>
                        <input
                            id="address.street"
                            name="address.street"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.street}
                        />
                        {formik.errors.address?.street ? <div className="text-danger">{formik.errors.address.street}</div> : null}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.houseNumber">House Number</label>
                        <input
                            id="address.houseNumber"
                            name="address.houseNumber"
                            type="number"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.houseNumber}
                        />
                        {formik.errors.address?.houseNumber ? <div className="text-danger">{formik.errors.address.houseNumber}</div> : null}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="address.zip">Zip</label>
                        <input
                            id="address.zip"
                            name="address.zip"
                            type="number"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.address.zip}
                        />
                        {formik.errors.address?.zip ? <div className="text-danger">{formik.errors.address.zip}</div> : null}
                    </div>
                </div>
            </form>
        </div>

    );
});

export default UpdateCard;