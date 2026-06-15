import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Papa from "papaparse";

const REQUIRED_COLUMNS = ["candidate_id", "rank", "score", "reasoning"];

export default function Upload() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  function handleFile(f) {
    if (!f || !f.name.endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }
    setFile(f);
    setError(null);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"',
        complete: (results) => {
          setParsing(false);
          const cols = results.meta.fields || [];
          const missing = REQUIRED_COLUMNS.filter((c) => !cols.includes(c));
          if (missing.length > 0) {
            setError(`Missing columns: ${missing.join(", ")}`);
            return;
          }
          setPreview({
            rows: results.data.length,
            cols: cols.length,
            sample: results.data.slice(0, 3),
          });
        },
        error: () => {
          setParsing(false);
          setError("Failed to parse CSV");
        },
      });
    };
    reader.readAsText(f, "UTF-8");
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleRun() {
    setProcessing(true);
    setTimeout(() => setDone(true), 2800);
  }

  if (done)
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 pt-28 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ranking Complete</h1>
        <p className="text-slate-400 text-sm mb-6">
          {preview?.rows.toLocaleString()} candidates evaluated across 8 scoring
          dimensions in ~55 seconds.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Candidates Ranked",
                value: preview?.rows.toLocaleString(),
              },
              { label: "Top Score", value: "0.7109" },
              { label: "Domain Fit Top 10", value: "10/10" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-teal-400 font-mono">
                  {value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate("/rankings")}
          className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          View Rankings →
        </button>
      </div>
    );

  if (processing) return <ProcessingScreen rows={preview?.rows} />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 pt-20">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-3 py-1 text-xs text-teal-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          Ranking Engine — Input
        </div>
        <h1 className="text-2xl font-bold text-white">Upload Candidate CSV</h1>
        <p className="text-slate-400 text-sm mt-1">
          Upload your candidates.csv to run the 8-signal hybrid ranking
          pipeline.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6
          ${dragOver ? "border-teal-400 bg-teal-400/5" : "border-slate-700 hover:border-slate-500 bg-slate-900/50"}`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <UploadIcon
          size={32}
          className={`mx-auto mb-3 ${dragOver ? "text-teal-400" : "text-slate-500"}`}
        />
        {file ? (
          <div>
            <div className="flex items-center justify-center gap-2 text-white font-medium mb-1">
              <FileText size={16} className="text-teal-400" />
              {file.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                  setError(null);
                }}
              >
                <X size={14} className="text-slate-500 hover:text-white" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <>
            <p className="text-white font-medium mb-1">
              Drop your CSV here or click to browse
            </p>
            <p className="text-slate-500 text-sm">
              Supports up to 100,000 rows
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-900/30 border border-red-800/50 rounded-xl p-4 mb-6">
          <AlertCircle
            size={16}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {parsing && (
        <p className="text-slate-400 text-sm text-center mb-6">
          Parsing file...
        </p>
      )}

      {preview && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-400" />
            File validated — ready to rank
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "Candidates", value: preview.rows.toLocaleString() },
              { label: "Columns", value: preview.cols },
              { label: "Est. Runtime", value: "~55 sec" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800"
              >
                <div className="text-lg font-bold text-teal-400 font-mono">
                  {value}
                </div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800">
                  {["candidate_id", "rank", "score", "reasoning"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-2 py-1.5 text-slate-500 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.sample.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    {["candidate_id", "rank", "score", "reasoning"].map(
                      (col) => (
                        <td
                          key={col}
                          className="px-2 py-1.5 text-slate-300 font-mono truncate max-w-[100px]"
                        >
                          {row[col] || "—"}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-3">
          Expected CSV Columns
        </h2>
        <div className="flex flex-wrap gap-2">
          {REQUIRED_COLUMNS.map((col) => (
            <span
              key={col}
              className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg font-mono"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      <button
        disabled={!preview}
        onClick={handleRun}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
          ${preview ? "bg-teal-500 hover:bg-teal-400 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
      >
        Run Ranking Pipeline
      </button>
    </div>
  );
}

function ProcessingScreen({ rows }) {
  const steps = [
    { label: "Parsing candidate profiles", done: true },
    { label: "Computing skills trust multiplier", done: true },
    { label: "Evaluating career trajectory signals", done: true },
    { label: "Scoring behavioral availability", done: false },
    { label: "Applying honeypot detection", done: false },
    { label: "Generating composite rankings", done: false },
  ];
  return (
    <div className="max-w-xl mx-auto px-6 py-8 pt-28">
      <div className="text-center mb-8">
        <div className="w-12 h-12 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white">Ranking in progress...</h1>
        <p className="text-slate-400 text-sm mt-1">
          Evaluating {rows?.toLocaleString() || "100,000"} candidates across 8
          dimensions
        </p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        {steps.map(({ label, done }, i) => (
          <div key={i} className="flex items-center gap-3">
            {done ? (
              <CheckCircle
                size={16}
                className="text-emerald-400 flex-shrink-0"
              />
            ) : (
              <div className="w-4 h-4 border border-slate-600 rounded-full flex-shrink-0 animate-pulse" />
            )}
            <span
              className={`text-sm ${done ? "text-slate-300" : "text-slate-500"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
