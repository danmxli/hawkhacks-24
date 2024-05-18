import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserInfoState {
    email: string
    isEmailSynced: boolean
}

const initialState: UserInfoState = {
    email: "",
    isEmailSynced: false
}

export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        updateEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
        updateIsEmailSynced: (state, action: PayloadAction<boolean>) => {
            state.isEmailSynced = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateEmail,updateIsEmailSynced } = userInfoSlice.actions

export default userInfoSlice.reducer