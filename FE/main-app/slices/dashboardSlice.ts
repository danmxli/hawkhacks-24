import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DashboardState {
    dashboardPhase: string
}

const initialState: DashboardState = {
    dashboardPhase: "home"
}

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        updateDashboardPhase: (state, action: PayloadAction<string>) => {
            state.dashboardPhase = action.payload
        }
    }
})

export const { updateDashboardPhase } = dashboardSlice.actions

export default dashboardSlice.reducer