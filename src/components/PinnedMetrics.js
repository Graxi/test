import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAggregatedData } from '../redux/reducers/metricsSlice';
import { Card, Flex } from 'antd';
import { METRICS } from '../consts/metrics';
import dayjs from 'dayjs';

const MetricCard = ({ data, loading = false }) => {
    const { metric, value } = data;

    const label = useMemo(() => {
        const idx = METRICS.findIndex(_ => _.value === metric);
        if (idx === -1) return '';
        return METRICS[idx].label;
    }, [ metric ]);

    return (
        <Card title={label} style={{ width: 300 }} loading={loading}>
            <p>{value}</p>
        </Card>
    )
}

const PinnedMetrics = () => {
    const dispatch = useDispatch();
    const aggregatedData = useSelector(state => state.metrics.aggregatedData);
    const activeFilter = useSelector(state => state.metrics.activeFilter);
    const [ loading, setLoading ] = useState(false);
    
    useEffect(() => {
        if (activeFilter) {
            const { num, unit } = activeFilter;
            const endDate = dayjs().format('YYYY-MM-DD');
            const startDate = dayjs().subtract(num, unit).format('YYYY-MM-DD');
            setLoading(true);
            dispatch(fetchAggregatedData({ startDate, endDate }))
            .then(() => {
                setLoading(false);
            })
        }
    }, [ activeFilter, dispatch ]);

    return (
        <Flex wrap='wrap' gap='32px' style={{
            margin: '24px 0'
        }}>
            {
                aggregatedData.map((data, index) => <MetricCard key={index} loading={loading} data={data} />)
            }
        </Flex>
    );
}

export default PinnedMetrics;