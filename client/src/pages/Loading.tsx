import { Box } from '@u_ui/u-ui'
import CircularProgress from '@u_ui/u-ui/CircularProgress'
import React from 'react'

export default function Loading() {
    return (
        <Box 
            sx={{
                width: '100dvw',
                height: '100dvh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <CircularProgress />
        </Box>
    )
}
