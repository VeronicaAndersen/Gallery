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
                    per_page: 30,
                    query: 'sport',
                    orientation: 'landscape',
                    client_id: process.env.REACT_APP_client_id
                },
            });
            console.log(response.data.results);
            
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
                    <div className="column" key={index}>
                        <img
                            key={image.id}
                            src={image.urls.regular}
                            alt={image.alt_description}
                            width="200"
                        />
                        <p>Photo: {image.user.username}</p>
                    </div>
                ))}
            </div>

            {error && <div className='ErrorMes'><p>{error.message}</p></div>}
        </div>
    );
};

export default Gallery;