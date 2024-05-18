import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ReceiptData } from '@/lib/utils'

export interface UserInfoState {
    email: string
    isEmailSynced: boolean
    receipts: ReceiptData
}

const initialState: UserInfoState = {
    email: "",
    isEmailSynced: false,
    receipts: []
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
        },
        updateReceipts: (state, action: PayloadAction<ReceiptData>) => {
            state.receipts = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateEmail, updateIsEmailSynced, updateReceipts } = userInfoSlice.actions

export default userInfoSlice.reducer