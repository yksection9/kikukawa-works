import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { Forecast } from './pages/Forecast'
import { Home } from './pages/Home'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { Privacy } from './pages/Privacy'
import { WorkDetail } from './pages/WorkDetail'
import { Works } from './pages/Works'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
        <Route path="/works/:slug" element={<WorkDetail />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/forecast/:industry" element={<Forecast />} />
        <Route path="/about" element={<About />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
