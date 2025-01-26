import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Install react-datepicker if not already installed
import 'react-datepicker/dist/react-datepicker.css';
import '../css/DateFilter.css'; // Import custom CSS for styling

const DateFilter: React.FC<{ onFilterChange: (startDate: Date | null, endDate: Date | null) => void }> = ({ onFilterChange }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleApplyFilter = () => {
        onFilterChange(startDate, endDate);
    };

    return (
        <div className="date-filter">
            <div className="date-picker-container">
       
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    className="date-picker"
                    dateFormat="yyyy/MM/dd"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                    className="date-picker"
                    dateFormat="yyyy/MM/dd"
                />
                     <i className='bx bx-calendar icon'></i>
            </div>
            <button className="apply-button" onClick={handleApplyFilter}>Filtered Dates</button>
        </div>
    );
};

export default DateFilter;
