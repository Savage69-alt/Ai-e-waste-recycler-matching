import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultsPage } from './pages/ResultsPage';
import { RecyclersPage } from './pages/RecyclersPage';
import { RecyclerDetailPage } from './pages/RecyclerDetailPage';
import { HistoryPage } from './pages/HistoryPage';
import { DashboardPage } from './pages/DashboardPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AnalysisResult, HandoverRequest, Recycler } from './types';
import { createDemoAnalysis } from './services/demoData';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedRecycler, setSelectedRecycler] = useState<Recycler | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // History & Handovers state initialized with realistic seed data
  const [historyList, setHistoryList] = useState<AnalysisResult[]>(() => [
    createDemoAnalysis(),
  ]);

  const [handoversList, setHandoversList] = useState<HandoverRequest[]>([
    {
      id: 'handover-seed-01',
      analysis_id: 'demo-analysis-seed',
      worker_name: 'Ramesh Scrap Works',
      phone: '+91 98205 11223',
      recycler_id: 'rec-01',
      recycler_name: 'EcoCircuits Green Solvers',
      e_waste_type: 'Laptop & PCB Components',
      estimated_weight_kg: 1.6,
      handover_type: 'pickup',
      preferred_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: 'Components boxed and segregated. Battery placed in isolated container.',
      status: 'Scheduled',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      estimated_value: 412,
    },
  ]);

  // Load server-side history & handovers on mount
  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.history && Array.isArray(data.history) && data.history.length > 0) {
          setHistoryList(data.history);
        }
      })
      .catch((err) => console.warn('Offline history mode:', err));

    fetch('/api/handover')
      .then((res) => res.json())
      .then((data) => {
        if (data.handovers && Array.isArray(data.handovers) && data.handovers.length > 0) {
          setHandoversList(data.handovers);
        }
      })
      .catch((err) => console.warn('Offline handover mode:', err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLaunchDemo = () => {
    const demo = createDemoAnalysis();
    setCurrentAnalysis(demo);
    setHistoryList((prev) => [demo, ...prev.filter((item) => item.id !== demo.id)]);
    setCurrentPage('results');
    showToast('Loaded Demo Analysis: Disassembled Notebook (Motherboard, Copper, Battery)');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    setHistoryList((prev) => [result, ...prev]);
    setCurrentPage('results');
    showToast('Analysis completed successfully!');
  };

  const handleSelectRecycler = (recycler: Recycler) => {
    setSelectedRecycler(recycler);
    setCurrentPage('recycler-detail');
  };

  const handleRecordHandover = (newHandover: HandoverRequest) => {
    setHandoversList((prev) => [newHandover, ...prev]);
    showToast(`Handover request dispatched to ${newHandover.recycler_name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLaunchDemo={handleLaunchDemo}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {currentPage === 'analyze' && (
          <AnalyzePage
            onAnalysisComplete={handleAnalysisComplete}
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {currentPage === 'results' && currentAnalysis && (
          <ResultsPage
            result={currentAnalysis}
            onNewAnalysis={() => setCurrentPage('analyze')}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onSelectRecycler={handleSelectRecycler}
            onNavigateToRecyclers={() => setCurrentPage('recyclers')}
            onRecordHandover={handleRecordHandover}
          />
        )}

        {currentPage === 'results' && !currentAnalysis && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-900">No Active Analysis</h2>
            <p className="text-xs text-slate-500">
              Please analyze a scrap photograph or load our verified demo sample.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleLaunchDemo}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
              >
                Load Verified Demo Sample
              </button>
              <button
                onClick={() => setCurrentPage('analyze')}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-xs"
              >
                Upload Photo
              </button>
            </div>
          </div>
        )}

        {currentPage === 'recyclers' && (
          <RecyclersPage
            onSelectRecycler={handleSelectRecycler}
            onRecordHandover={handleRecordHandover}
          />
        )}

        {currentPage === 'recycler-detail' && selectedRecycler && (
          <RecyclerDetailPage
            recycler={selectedRecycler}
            onBack={() => setCurrentPage('recyclers')}
            onRecordHandover={handleRecordHandover}
          />
        )}

        {currentPage === 'history' && (
          <HistoryPage
            historyList={historyList}
            onSelectAnalysis={(item) => {
              setCurrentAnalysis(item);
              setCurrentPage('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAnalyze={() => setCurrentPage('analyze')}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            historyList={historyList}
            handoversList={handoversList}
            onNavigateToAnalyze={() => setCurrentPage('analyze')}
            onNavigateToRecyclers={() => setCurrentPage('recyclers')}
          />
        )}

        {currentPage === 'knowledge' && <KnowledgePage />}
      </main>

      {/* Floating "Ask EcoValue AI" Button */}
      <button
        id="floating-assistant-trigger-btn"
        type="button"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all border border-emerald-400/30"
        title="Ask e-waste safety, valuation, or recycling questions"
      >
        <Bot className="w-4 h-4 text-emerald-200" />
        <span>Ask EcoValue AI</span>
      </button>

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentAnalysis={currentAnalysis}
      />

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
