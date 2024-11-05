import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../images/search.png';
import '../css/search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [results, setResults] = useState<User[]>([]);
    const navigate = useNavigate();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 2) {
            try {
                const response = await axios.get(`http://localhost:8081/search_users?query=${term}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setResults([]);
        }
    };

    const handleResultClick = (userId: number) => {
        navigate(`/user_profile/${userId}`);
    };

    interface User {
        id: number;
        first_name: string;
        last_name: string;
        image: string; // Assuming you have a profile image URL
    }

    return (
        <div>
            <div className="search-box">
                <img src={searchIcon} alt="Search" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map(user => (
                        <li key={user.id} onClick={() => handleResultClick(user.id)}>
                            {user.image && (
                                <img src={`http://localhost:8081/uploads/${user.image}`}  style={{width: '10%', borderRadius:'50%', height: 'auto'}}  />
                            )}
                            {user.first_name} {user.last_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
