import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './chartReducer'
export default configureStore({
    reducer: {
        dashboard: dashboardReducer
    },
})
