import React, { useState } from 'react';
import { Loader2, RefreshCw, FileText } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeInsuranceDocument } from './services/geminiService';
import { AnalysisStatus, FileData, InsuranceAnalysis } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<InsuranceAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (fileData: FileData) => {
    setCurrentFile(fileData);
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMessage(null);

    try {
      const result = await analyzeInsuranceDocument(fileData.base64, fileData.mimeType);
      setAnalysisResult(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
      setErrorMessage("We couldn't analyze that document. Please ensure it's a clear insurance policy document and try again.");
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setCurrentFile(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro Section - Only show when IDLE */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Understand your health insurance <br/>
              <span className="text-blue-600">in seconds.</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't get lost in the fine print. Upload your policy document, and we'll tell you exactly what's covered, how to claim, and what you get paid back.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <FileUpload onFileSelected={handleFileSelected} />
          </div>
        )}

        {/* Loading State */}
        {status === AnalysisStatus.ANALYZING && (
          <div className="max-w-xl mx-auto text-center py-20 animate-fade-in">
             <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <FileText className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Policy Document...</h3>
             <p className="text-slate-500">
               Our AI is reading through the fine print to find your coverage details. <br/>
               This typically takes 10-20 seconds.
             </p>
          </div>
        )}

        {/* Results State */}
        {status === AnalysisStatus.SUCCESS && analysisResult && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                {currentFile?.previewUrl ? (
                  <img src={currentFile.previewUrl} alt="Document Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <FileText size={20} />
                  </div>
                )}
                <div>
                   <p className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">{currentFile?.file.name}</p>
                   <p className="text-xs text-slate-500">Analyzed successfully</p>
                </div>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Analyze New
              </button>
            </div>
            
            <ResultsDisplay analysis={analysisResult} />
          </div>
        )}

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={32} className="animate-spin" /> 
              {/* Using loader as a placeholder, but static icon would be better if we weren't just reusing imports */}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
            <p className="text-slate-600 mb-8">{errorMessage}</p>
            <button 
              onClick={handleReset}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
            >
              Try Another Document
            </button>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <p className="text-slate-400 text-sm">© {new Date().getFullYear()} InsurClear. Powered by Gemini 3 Flash.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
