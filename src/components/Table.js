import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNonAggregatedData } from '../redux/reducers/metricsSlice';
import { DownOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Space, Table, Input } from 'antd';
import { METRICS } from '../consts/metrics';
import dayjs from 'dayjs';

const { Search } = Input;

const TableWrapper = () => {
//   const expandedRowRender = () => {
//     const columns = [
//       {
//         title: 'Date',
//         dataIndex: 'date',
//         key: 'date',
//       },
//       {
//         title: 'Name',
//         dataIndex: 'name',
//         key: 'name',
//       },
//       {
//         title: 'Status',
//         key: 'state',
//         render: () => <Badge status="success" text="Finished" />,
//       },
//       {
//         title: 'Upgrade Status',
//         dataIndex: 'upgradeNum',
//         key: 'upgradeNum',
//       },
//       {
//         title: 'Action',
//         dataIndex: 'operation',
//         key: 'operation',
//         render: () => (
//           <Space size="middle">
//             <a>Pause</a>
//             <a>Stop</a>
//             <Dropdown
//               menu={{
//                 items,
//               }}
//             >
//               <a>
//                 More <DownOutlined />
//               </a>
//             </Dropdown>
//           </Space>
//         ),
//       },
//     ];
//     const data = [];
//     for (let i = 0; i < 3; ++i) {
//       data.push({
//         key: i.toString(),
//         date: '2014-12-24 23:12:00',
//         name: 'This is production name',
//         upgradeNum: 'Upgraded: 56',
//       });
//     }
//     return <Table columns={columns} dataSource={data} pagination={false} />;
//   };
    const dispatch = useDispatch();
    const nonAggregatedData = useSelector(state => state.metrics.nonAggregatedData);
    const activeFilter = useSelector(state => state.metrics.activeFilter);
    const [ loading, setLoading ] = useState(false);

    // search metrics
    const [ searchInput, setSearchInput ] = useState('');

    useEffect(() => {
        if (activeFilter) {
            const { num, unit } = activeFilter;
            const endDate = dayjs().format('YYYY-MM-DD');
            const startDate = dayjs().subtract(num, unit).format('YYYY-MM-DD');
            setLoading(true);
            dispatch(fetchNonAggregatedData({ startDate, endDate }))
            .then(() => {
                setLoading(false);
            })
        }
    }, [ activeFilter, dispatch ]);

    // use search input to filtered the metrics
    const filteredMetrics = useMemo(() => {
        // search input separator: ,
        const toArray = searchInput.toLowerCase().split(',');

        const filtered = searchInput ? METRICS.filter(m => toArray.includes(m.label.toLowerCase())) : METRICS;

        return filtered.map(metric => ({
            title: metric.label,
            key: metric.value,
            dataIndex: metric.value
        }))
    }, [ searchInput ]);

    return (
        <div style={{
            flex: 1
        }}>
            <Search
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for metrics..."
                style={{
                    width: '300px',
                    margin: '20px 0'
                }} />
            <Table
                loading={loading}
                columns={filteredMetrics}
                // expandable={{
                //   expandedRowRender,
                //   defaultExpandedRowKeys: ['0'],
                // }}
                dataSource={nonAggregatedData}
                size="small"
            />
        </div>
    );
};
export default TableWrapper;