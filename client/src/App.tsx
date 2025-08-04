import type React from "react"
import { createTheme, CssBaseline, ThemeProvider } from "@u_ui/u-ui"
import { Outlet } from "react-router-dom"

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark'
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  )
}

export default App
