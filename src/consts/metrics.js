
export const TIME_FILTERS = Object.freeze([
    { unit: 'day', num: 7, label: '7D' },
    { unit: 'day', num: 14, label: '14D' },
    { unit: 'month', num: 1, label: '1M' },
    { unit: 'month', num: 3, label: '3M' },
    { unit: 'year', num: 1, label: 'YTD' }
]);

export const METRICS = Object.freeze([
    { value: 'cpm', label: 'CPM' },
    { value: 'purchase_roas.omni_purchase', label: 'ROAS' },
    { value: 'spend', label: 'Spend' },
    { value: 'actions.omni_purchase', label: '#purchase' },
    { value: 'ctr', label: 'CTR' },
    { value: 'market_name', label: 'market_name' }
])
  