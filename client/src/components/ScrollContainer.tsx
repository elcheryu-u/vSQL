import { Box } from '@u_ui/u-ui'
import React from 'react'

export default function ScrollContainer({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ pr: 1.5, overflowY: 'auto', colorScheme: 'dark', height: '100%', flex: 1 }}>
            {children}
        </Box>
    )
}
