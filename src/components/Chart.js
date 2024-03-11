import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from '@ant-design/charts';
import { Select } from 'antd';
import { METRICS } from '../consts/metrics';

const Chart = () => {
    // const data = [
    //     { year: '1991', value: 3 },
    //     { year: '1992', value: 4 },
    //     { year: '1993', value: 3.5 },
    //     { year: '1994', value: 5 },
    //     { year: '1995', value: 4.9 },
    //     { year: '1996', value: 6 },
    //     { year: '1997', value: 7 },
    //     { year: '1998', value: 9 },
    //     { year: '1999', value: 13 },
    // ];


    const [ selectedMetric, setSelectedMetric ] = useState(METRICS[0]);
    const nonAggregatedData = useSelector(state => state.metrics.nonAggregatedData);

    const data = useMemo(() => {
        return nonAggregatedData.map(data => ({
            index: data.key,
            value: data[selectedMetric.value]
        }))
    }, [ nonAggregatedData, selectedMetric ]);

    return (
        <div>
            <Select
                defaultValue={selectedMetric.value}
                style={{ width: 120 }}
                onChange={value => setSelectedMetric(METRICS.find(_ => _.value === value))}
                options={METRICS}
            />

            <div style={{
                width: 400,
                height: 300,
                marginTop: '20px'
            }}>
                <Line data={data} xField='index' yField='value' />
            </div>
        </div>
    )
};
export default Chart