import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TIME_FILTERS } from '../consts/metrics';
import { setActiveFilter } from '../redux/reducers/metricsSlice';
import { Segmented } from 'antd';

const TimeFilter = () => {
    const dispatch = useDispatch();
    const activeFilter = useSelector(state => state.metrics.activeFilter);

    return (
        <Segmented
            options={TIME_FILTERS.map(f => f.label)}
            onChange={(label) => {
                const filter = TIME_FILTERS.find(f => f.label === label);
                dispatch(setActiveFilter(filter));
            }}
            defaultValue={activeFilter.label}
        />
    )
};
export default TimeFilter;