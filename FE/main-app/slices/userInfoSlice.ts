import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserInfoState {
    email: string
}

const initialState: UserInfoState = {
    email: "",
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        updateEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateEmail } = userInfoSlice.actions

export default userInfoSlice.reducer