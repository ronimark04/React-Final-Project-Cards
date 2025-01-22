import { useContext } from "react";
import { SiteTheme } from "../App";

function About() {

    const themes = useContext(SiteTheme);

    return (
        <div className="container my-5" style={{ color: themes.page.textColor }}>
            <h1 className="display-4 text-center mb-4" style={{ marginTop: "-50px", fontWeight: "600", fontSize: "3rem" }}>About Us</h1>
            <p className="lead text-center mb-5">
                Welcome to BusinessCardHub, the platform where businesses connect, grow, and shine.
            </p>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <h3>Our Mission</h3>
                    <p>
                        At BusinessCardHub, our mission is to empower businesses and professionals by providing
                        a platform to showcase their services, network with others, and discover new opportunities.
                        Whether you're a freelancer, a small business owner, or part of a large organization,
                        we aim to help you build meaningful connections.
                    </p>
                </div>
                <div className="col-md-6 mb-4">
                    <h3>What We Offer</h3>
                    <ul>
                        <li>Upload and manage virtual business cards for your business.</li>
                        <li>Discover and interact with other businesses' cards.</li>
                        <li>Like and save cards that resonate with you for future reference.</li>
                        <li>Effortlessly showcase your services to a wider audience.</li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <h3>Why Choose BusinessCardHub?</h3>
                    <p>
                        BusinessCardHub simplifies the way you network and market your services. In a digital
                        age, having a strong and accessible presence is key to success. Our platform ensures
                        that your business can be found, remembered, and connected with.
                    </p>
                </div>
                <div className="col-md-6 mb-4">
                    <h3>How It Works</h3>
                    <ol>
                        <li>Create an account and log in.</li>
                        <li>Upload your business card with key details like your business name, description, and contact information.</li>
                        <li>Browse cards uploaded by others, interact with them, and show your appreciation with likes.</li>
                        <li>Enjoy networking and building professional relationships.</li>
                    </ol>
                </div>
            </div>
            <div className="text-center mt-5">
                <h4>Join our growing community today!</h4>
                <p>
                    Whether you're looking to expand your business, discover services, or connect with
                    like-minded professionals, BusinessCardHub is the perfect platform for you.
                </p>
            </div>
        </div>
    );
}

export default About;
