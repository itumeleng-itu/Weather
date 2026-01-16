import './App.css'
import Weather from './pages/weather'
import { ThemeProvider } from './context/ThemeContext'
import { UnitProvider } from './context/UnitContext'

export default function App() {
  return (
    <ThemeProvider>
      <UnitProvider>
        <Weather />
      </UnitProvider>
    </ThemeProvider>
  )
}
