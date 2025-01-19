import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const createGoogleMap = async (address) => {
    // Geocode the address
    const geocodeAddress = async () => {
        const fullAddress = `${address.street} ${address.houseNumber}, ${address.city}, ${address.state}, ${address.country}`;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    fullAddress
                )}&key=AIzaSyDSQRxFvaJ7gBHl4viRz8_UtbHXDi9RVaA`
            );
            const data = await response.json();
            if (data.results.length > 0) {
                return data.results[0].geometry.location;
            } else {
                throw new Error("Geocoding error: No results found");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            throw error;
        }
    };

    const coordinates = await geocodeAddress();

    return ({ isLoaded }) => {
        if (!isLoaded) return <div>Loading map...</div>;

        return (
            <GoogleMap
                center={coordinates}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "400px" }}
            >
                <Marker position={coordinates} />
            </GoogleMap>
        );
    };
};

export default createGoogleMap;
