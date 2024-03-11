import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIME_FILTERS } from '../../consts/metrics';

// shared method
const _fetchDataByDateRange = async (payload) => {
    const { startDate, endDate, aggregation } = payload;
    const res1 = await fetch('https://z62x5u2bnl.execute-api.us-east-1.amazonaws.com/dev/dataRequest', {
        method: 'POST',
        body: JSON.stringify({
            user_id: 'gifteal',
            x_level: 'ad_market',
            y_level: 'ad_market',
            y: ['gifteal_global'],
            start_time: startDate,
            end_time: endDate,
            aggregation,
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'shulabs_data_fetcher_api_key'
        }
    });
    if (res1.status === 200) {
        const json = await res1.json();
        const { job_id, status, value } = json;
        if (status === 'error') {
            // server error
            return { error: 'Something went wrong' }
        } else if (status === 'queued' || status === 'processing') {
            // fetch dataSet by job id
            if (job_id) {
                const res2 = await _fetchDataByJobId(job_id);
                if (res2.data) {
                    return res2;
                }
            }
        } else if (status === 'success') {
            if (value) {
                return {
                    data: JSON.parse(value)
                }
            }
        }
    } else {
        return {
            error: 'Something went wrong'
        }
    }
}

// fetch data set by job id
const _fetchDataByJobId = async (jobId) => {
    const response = await fetch('https://z62x5u2bnl.execute-api.us-east-1.amazonaws.com/dev/dataStatus', {
        method: 'POST',
        body: JSON.stringify({
            job_id: jobId
        }),
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'shulabs_data_fetcher_api_key'
        }
    });
    if (response.status === 200) {
        const json = await response.json();
        const { job_id, status, value } = json;
        if (status === 'Not Found' || status === 'error') {
            return {
                error: 'Something went wrong'
            }
        } else if (status === 'queued' || status === 'processing') {
            return await _fetchDataByJobId(job_id);
        } else if (status === 'success') {
            if (value) {
                return {
                    data: JSON.parse(value)
                }
            }
        }
    } else {
        return {
            error: 'Something went wrong'
        }
    }
}

export const fetchNonAggregatedData = createAsyncThunk(
    'metrics/fetchNonAggregatedData',
    async (payload) => {
        const { startDate, endDate } = payload;
        return await _fetchDataByDateRange({
            startDate,
            endDate,
            aggregation: false
        })
    }
)

// fetch aggregated metrics data
export const fetchAggregatedData = createAsyncThunk(
    'metrics/fetchAggregatedData',
    async (payload) => {
        const { startDate, endDate } = payload;
        return await _fetchDataByDateRange({
            startDate,
            endDate,
            aggregation: true
        })
    }
);

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    activeFilter: TIME_FILTERS[0],
    nonAggregatedData: [], // { metric1: '', metric2: '', ... }[]
    aggregatedData: [], // { metric: '', value: '' }[]
  },
  reducers: {
    setActiveFilter: (state, action) => {
        state.activeFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNonAggregatedData.fulfilled, (state, action) => {
        // set job id or set data set
        const { data } = action.payload || {};
        if (data) {
            // transform the data into desired format: { metric1: '', metric2: '',... }[]
            const array = [];
            for(const metric in data) {
                const value = data[metric]; // { 0: '', 1: '', ...}
                for(const index in value) {
                    if (!array[index]) {
                        array[index] = {
                            key: index
                        };
                    }
                    array[index][metric] = value[index];
                }
            }
            state.nonAggregatedData = array;
        } else {
            // server error
        }
    })
    builder.addCase(fetchAggregatedData.fulfilled, (state, action) => {
        // set job id or set data set
        const { data } = action.payload || {};
        if (data) {
            // transform the data into desired format: { metric: '', value: '' }[]
            const array = [];
            for(const metric in data) {
                const value = data[metric]; // { 0: ''}
                array.push({
                    metric,
                    value: value[0]
                })
            }
            state.aggregatedData = array;
        } else {
            // server error
        }
    })
  }
})

// Action creators are generated for each case reducer function
export const { setActiveFilter } = metricsSlice.actions

export default metricsSlice.reducer