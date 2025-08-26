import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import './SearchAndFilter.css';

export default function SearchAndFilter({ onFilterChange }) {
    const { t } = useTranslation('search');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);

    const fileTypes = ['jpeg', 'pdf', 'doc', 'xls'];

    const handleTypeChange = (type) => {
        setSelectedTypes(prevTypes =>
            prevTypes.includes(type)
                ? prevTypes.filter(t => t !== type)
                : [...prevTypes, type]
        );
    };

    const handleApplyFilters = () => {
        const filters = {
            search: searchTerm,
            types: selectedTypes,
            dateRange: dateRange[0]
        };
        if (onFilterChange) {
            onFilterChange(filters);
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedTypes([]);
        setDateRange([
            {
                startDate: null,
                endDate: null,
                key: 'selection',
            },
        ]);
        if (onFilterChange) {
            onFilterChange({
                search: '',
                types: [],
                dateRange: { startDate: null, endDate: null }
            });
        }
    };

    return (
        <motion.div
            className="search-filter-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-center mb-4">
                <i className="bi bi-search me-2"></i>{t('title')}
            </h2>

            <div className="search-bar mb-3">
                <input
                    type="text"
                    placeholder={t('placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="filters-row row gx-3 gy-2">
                <div className="col-12 col-md-6">
                    <div className="filter-card">
                        <h5>{t('filter.typeTitle')}</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {fileTypes.map(type => (
                                <button
                                    key={type}
                                    className={`btn ${selectedTypes.includes(type) ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => handleTypeChange(type)}
                                >
                                    {type.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="filter-card">
                        <h5>{t('filter.dateTitle')}</h5>
                        <DateRangePicker
                            ranges={dateRange}
                            onChange={item => setDateRange([item.selection])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            direction="horizontal"
                        />
                    </div>
                </div>
            </div>

            <div className="action-buttons d-flex justify-content-center gap-3 mt-4">
                <button className="btn btn-success" onClick={handleApplyFilters}>
                    {t('applyButton')}
                </button>
                <button className="btn btn-secondary" onClick={handleResetFilters}>
                    {t('resetButton')}
                </button>
            </div>
        </motion.div>
    );
}