// App: Router and context providers

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoundProvider } from './hooks/useRound';
import { RegularsProvider } from './hooks/useRegulars';
import { Header } from './components/Header';
import { RoundPage } from './pages/RoundPage';
import { SummaryPage } from './pages/SummaryPage';
import { RegularsPage } from './pages/RegularsPage';
import { ReloadPrompt } from './components/ReloadPrompt';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <RoundProvider>
        <RegularsProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<RoundPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/regulars" element={<RegularsPage />} />
              </Routes>
            </main>
            <ReloadPrompt />
          </div>
        </RegularsProvider>
      </RoundProvider>
    </BrowserRouter>
  );
}

export default App;
