import React, { useEffect, useState } from 'react';
import axios from 'axios';
require('dotenv').config()

const Gallery = () => {
    const url = 'https://api.unsplash.com/search/photos';
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const fetchInfo = async () => {
        try {
            const response = await axios.get(url, {
                params: {
                    query: 'sport',
                    orientation: 'landscape',
                    page: 20,
                    client_id: process.env.REACT_APP_client_id 
                },
            });
            setData(response.data);

        } catch (error) {
            setError(error);
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <div>
            <h1>GALLERY</h1>
            <div className="container">
                {data.results?.map((image, index) => (
                    <div className="column">
                        <img
                            key={index}
                            src={image.urls.regular}
                            alt={image.alt_description}
                            width="200">
                        </img>
                        <div>{image.alt_description}</div>
                    </div>
                ))}
            </div>

            {error && <div className='ErrorMes'><p>{error.message}</p></div>}
        </div>
    );
};

export default Gallery;
