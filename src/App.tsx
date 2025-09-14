import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import Points from './pages/Points'
import PointDetail from './pages/PointDetail'
import Indications from './pages/Indications'
import IndicationDetail from './pages/IndicationDetail'
import Modalities from './pages/Modalities'
import BodyMap from './pages/BodyMap'
import Protocols from './pages/Protocols'
import ProtocolBuilder from './pages/ProtocolBuilder'
import TCMTheory from './pages/TCMTheory'
import AcupressureProtocols from './pages/AcupressureProtocols'
import CuppingProtocols from './pages/CuppingProtocols'
import GuaShaProtocols from './pages/GuaShaProtocols'
import AppliedKinesiologyProtocols from './pages/AppliedKinesiologyProtocols'
import Settings from './pages/Settings'

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/points" element={<Points />} />
          <Route path="/points/:id" element={<PointDetail />} />
          <Route path="/indications" element={<Indications />} />
          <Route path="/indications/:id" element={<IndicationDetail />} />
          <Route path="/modalities" element={<Modalities />} />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/protocols/:id" element={<ProtocolBuilder />} />
          <Route path="/theory" element={<TCMTheory />} />
          <Route path="/acupressure" element={<AcupressureProtocols />} />
          <Route path="/cupping" element={<CuppingProtocols />} />
          <Route path="/gua-sha" element={<GuaShaProtocols />} />
          <Route path="/applied-kinesiology" element={<AppliedKinesiologyProtocols />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
