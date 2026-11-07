'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { DocumentItem } from '@/types';
import { Modal } from '@/components/common/Modal';
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function DocumentVaultPage() {
  const { documents, uploadDocument, deleteDocument, allScholarships, savedScholarshipIds } =
    useApp();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] =
    useState<DocumentItem['documentType']>('Income Certificate');
  const [customFileName, setCustomFileName] = useState('');
  const [notes, setNotes] = useState('');

  const docTypes: DocumentItem['documentType'][] = [
    'Aadhaar Card',
    'Income Certificate',
    'Caste Certificate',
    'Domicile Certificate',
    'Previous Academic Marksheet',
    'Bonafide Certificate',
    'Bank Passbook',
    'Passport-size Photograph',
    'Statement of Purpose / Essay',
  ];

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = customFileName.trim() || `${selectedDocType.replace(/\s+/g, '_')}_Official.pdf`;

    uploadDocument({
      documentType: selectedDocType,
      fileName,
      fileSize: '1.4 MB',
      fileType: 'application/pdf',
      verified: true,
      notes: notes || 'Uploaded and verified for academic session.',
    });

    setCustomFileName('');
    setNotes('');
    setUploadModalOpen(false);
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomFileName(file.name);
    }
  };

  const uploadedTypes = new Set<string>(documents.map((d) => d.documentType));

  // Compute readiness across saved scholarships
  const savedScholarships = allScholarships.filter((s) => savedScholarshipIds.includes(s.id));

  return (
    <DashboardLayout
      title="Student Document Vault"
      subtitle="Organize, index and verify all scholarship documents in one centralized, local repository."
    >
      <div className="space-y-8">
        {/* Top Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5 leading-relaxed">
            <strong className="font-bold text-teal-950">Privacy-First Architecture: </strong>
            Documents are managed via local browser metadata for security. Sensitive personal certificates are not uploaded to public servers.
          </div>
        </div>

        {/* 2-Column: Vault Status Matrix Left, Uploaded Files Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (1 Col): Master Documents Checklist */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#171B2D] uppercase tracking-wider">
                Document Readiness
              </h3>
              <span className="text-xs font-black text-teal-600">
                {uploadedTypes.size} of {docTypes.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {docTypes.map((type) => {
                const isUploaded = uploadedTypes.has(type);
                return (
                  <div
                    key={type}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {isUploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className={isUploaded ? 'font-bold text-slate-800' : 'text-slate-500'}>
                        {type}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUploaded
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isUploaded ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-md shadow-[#5B4BDB]/25 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Upload New Document
            </button>
          </div>

          {/* Right Column (2 Cols): Active Document Inventory */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171B2D]">
                  Vault Files ({documents.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to link and verify across all government and private applications
                </p>
              </div>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEEAFE] hover:bg-indigo-100 text-[#5B4BDB] text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                Add File
              </button>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-xs text-slate-500">
                No documents uploaded yet. Upload your certificates to automate application readiness.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-bold text-[#171B2D] truncate">
                          {doc.fileName}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-[#5B4BDB]">{doc.documentType}</span>
                          <span>•</span>
                          <span>{doc.fileSize}</span>
                          <span>•</span>
                          <span>
                            {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {doc.notes && (
                          <div className="text-[11px] text-slate-400 italic">{doc.notes}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete from vault"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Document Coverage for Saved Scholarships */}
            {savedScholarships.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-[#171B2D]">
                    Coverage Matrix for Bookmarked Scholarships
                  </h4>
                  <Link
                    href="/saved"
                    className="text-xs font-bold text-[#5B4BDB] hover:underline"
                  >
                    View Saved
                  </Link>
                </div>

                <div className="space-y-3">
                  {savedScholarships.map((s) => {
                    const required = s.requiredDocuments || [];
                    const satisfied = required.filter((r) => uploadedTypes.has(r)).length;
                    const pct =
                      required.length > 0 ? Math.round((satisfied / required.length) * 100) : 100;

                    return (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#171B2D] line-clamp-1">{s.title}</span>
                          <span className="text-[11px] text-slate-500">
                            {satisfied} of {required.length} required documents uploaded in vault
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              pct === 100
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {pct}% Ready
                          </span>
                          <Link
                            href={`/scholarships/${s.id}`}
                            className="text-xs font-bold text-[#5B4BDB] hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Record New Document in Vault"
        subtitle="Select a file from your computer or specify certificate details."
      >
        <form onSubmit={handleSimulatedUpload} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Document Category
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value as DocumentItem['documentType'])}
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-[#171B2D] font-semibold"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Select Local File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleNativeFileChange}
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EEEAFE] file:text-[#5B4BDB]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Custom Document Label / File Name
            </label>
            <input
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="e.g. Income_Certificate_2026.pdf"
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#171B2D] uppercase tracking-wider block">
              Notes (e.g. Issuing Authority, Expiry Date)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Valid until March 2027 by Tehsildar Office"
              className="w-full bg-[#F8F9FC] border border-slate-200 rounded-xl p-2.5 text-xs text-[#171B2D]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#5B4BDB] hover:bg-[#4838C2] text-white text-xs font-bold transition-all shadow-md shadow-[#5B4BDB]/25"
            >
              Save to Vault
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
