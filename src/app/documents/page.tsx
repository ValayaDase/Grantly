'use client';

import React, { useMemo, useRef, useState } from 'react';
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
  Eye,
  Search,
  X,
  FileImage,
  File,
  FolderOpen,
  LockKeyhole,
  CloudUpload,
  LayoutGrid,
  List,
  Filter,
  Info,
} from 'lucide-react';

const DOC_TYPES: DocumentItem['documentType'][] = [
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

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function DocumentVaultPage() {
  const {
    documents,
    uploadDocument,
    deleteDocument,
    allScholarships,
    savedScholarshipIds,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);

  const [selectedDocType, setSelectedDocType] =
    useState<DocumentItem['documentType']>('Income Certificate');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isDragging, setIsDragging] = useState(false);

  const uploadedTypes = useMemo(
    () => new Set<string>(documents.map((doc) => doc.documentType)),
    [documents]
  );

  const savedScholarships = allScholarships.filter((scholarship) =>
    savedScholarshipIds.includes(scholarship.id)
  );

  const uploadedCount = uploadedTypes.size;
  const readinessPercentage = Math.round(
    (uploadedCount / DOC_TYPES.length) * 100
  );

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' || doc.documentType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension || '')
    ) {
      alert('Please select a PDF, JPG, or PNG file.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10 MB.');
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setNotes('');
    setSelectedDocType('Income Certificate');
    setUploadModalOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      validateFile(file);
    }

    // Allows selecting the same file again.
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement | HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const isValid = validateFile(file);

      if (isValid) {
        setUploadModalOpen(true);
      }
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a document first.');
      return;
    }

    uploadDocument({
      documentType: selectedDocType,
      fileName: selectedFile.name,
      fileSize: formatFileSize(selectedFile.size),
      fileType: selectedFile.type || 'application/octet-stream',
      verified: false,
      notes: notes.trim() || 'Document uploaded. Verification pending.',
    });

    setSelectedFile(null);
    setNotes('');
    setUploadModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteDocument(deleteTarget.id);
    setDeleteTarget(null);

    if (previewDoc?.id === deleteTarget.id) {
      setPreviewDoc(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith('image/')) {
      return FileImage;
    }

    if (fileType === 'application/pdf') {
      return FileText;
    }

    return File;
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType === 'application/pdf') return 'PDF';
    if (fileType?.startsWith('image/')) return 'IMAGE';
    return 'FILE';
  };

  return (
    <DashboardLayout
      title="Document Vault"
      subtitle="Keep your scholarship documents organized and ready for applications."
    >
      <div className="space-y-7">

        {/* Privacy information */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Your documents, organized in one place
            </h3>

            <p className="text-xs leading-relaxed text-slate-600">
              This prototype stores document details such as file name,
              category, and size in the application state. Actual file contents
              are not uploaded or permanently stored. Document verification
              must be performed separately.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Documents"
            value={documents.length}
            description="Documents in your vault"
            icon={<FolderOpen className="h-5 w-5" />}
            color="indigo"
          />

          <StatCard
            title="Document Categories"
            value={uploadedCount}
            description={`Out of ${DOC_TYPES.length} categories`}
            icon={<FileText className="h-5 w-5" />}
            color="blue"
          />

          <StatCard
            title="Missing Documents"
            value={DOC_TYPES.length - uploadedCount}
            description="Categories yet to be added"
            icon={<AlertCircle className="h-5 w-5" />}
            color="amber"
          />

          <StatCard
            title="Vault Readiness"
            value={`${readinessPercentage}%`}
            description="Based on document categories"
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="emerald"
          />
        </div>

        {/* Readiness and inventory */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Readiness checklist */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Document Readiness
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Your document checklist
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                {uploadedCount}/{DOC_TYPES.length}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Overall progress
                </span>
                <span className="font-bold text-slate-900">
                  {readinessPercentage}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${readinessPercentage}%` }}
                />
              </div>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {DOC_TYPES.map((type) => {
                const isUploaded = uploadedTypes.has(type);

                return (
                  <div
                    key={type}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {isUploaded ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-slate-300" />
                      )}

                      <span
                        className={`text-xs ${
                          isUploaded
                            ? 'font-semibold text-slate-800'
                            : 'text-slate-500'
                        }`}
                      >
                        {type}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        isUploaded
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isUploaded ? 'Added' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={openUploadModal}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add New Document
            </button>
          </div>

          {/* Document inventory */}
          <div className="space-y-5 xl:col-span-2">

            {/* Inventory heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  My Documents
                  <span className="ml-2 text-sm font-medium text-slate-400">
                    ({documents.length})
                  </span>
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your uploaded document records.
                </p>
              </div>

              <button
                onClick={openUploadModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
            </div>

            {/* Drag and drop area */}
            <section
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                if (
                  !e.currentTarget.contains(
                    e.relatedTarget as Node | null
                  )
                ) {
                  setIsDragging(false);
                }
              }}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CloudUpload className="h-6 w-6" />
              </div>

              <h4 className="text-sm font-bold text-slate-800">
                Drag and drop your files here
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                or click to browse files from your computer
              </p>

              <p className="mt-3 text-[10px] font-medium text-slate-400">
                PDF, JPG, PNG · Maximum file size: 10 MB
              </p>
            </section>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                handleFileChange(e);

                if (e.target.files?.[0]) {
                  setUploadModalOpen(true);
                }
              }}
            />

            {/* Search and filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 sm:w-48"
                  >
                    <option value="All">All Categories</option>

                    {DOC_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-lg p-2 transition ${
                      viewMode === 'list'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setViewMode('grid')}
                    className={`rounded-lg p-2 transition ${
                      viewMode === 'grid'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document list */}
            {filteredDocuments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <FolderOpen className="h-6 w-6" />
                </div>

                <h4 className="text-sm font-bold text-slate-800">
                  {documents.length === 0
                    ? 'Your vault is empty'
                    : 'No matching documents'}
                </h4>

                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                  {documents.length === 0
                    ? 'Add your certificates and academic documents to organize your scholarship application records.'
                    : 'Try changing your search term or selecting another category.'}
                </p>

                {documents.length === 0 && (
                  <button
                    onClick={openUploadModal}
                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    Upload First Document
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
                    : 'space-y-3'
                }
              >
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.fileType);

                  return (
                    <div
                      key={doc.id}
                      className={`group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md ${
                        viewMode === 'list'
                          ? 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
                          : 'space-y-4'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <FileIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs font-bold text-slate-900">
                            {doc.fileName}
                          </h4>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-semibold text-indigo-600">
                              {doc.documentType}
                            </span>

                            <span>•</span>

                            <span>{doc.fileSize}</span>

                            <span>•</span>

                            <span>
                              {getFileTypeLabel(doc.fileType)}
                            </span>
                          </div>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Added{' '}
                            {new Date(doc.uploadedAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            doc.verified
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {doc.verified ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}

                          {doc.verified
                            ? 'Verified'
                            : 'Not verified'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(doc)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Delete document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Scholarship coverage */}
        {savedScholarships.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Scholarship Document Coverage
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Check whether you have the documents required by your saved scholarships.
                </p>
              </div>

              <Link
                href="/saved"
                className="text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
              >
                View Saved Scholarships →
              </Link>
            </div>

            <div className="space-y-3">
              {savedScholarships.map((scholarship) => {
                const required = scholarship.requiredDocuments || [];

                const satisfied = required.filter((requiredDoc) =>
                  uploadedTypes.has(requiredDoc)
                ).length;

                const percentage =
                  required.length > 0
                    ? Math.round((satisfied / required.length) * 100)
                    : 100;

                return (
                  <div
                    key={scholarship.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-bold text-slate-900">
                          {scholarship.title}
                        </h4>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {satisfied} of {required.length} required documents available
                        </p>

                        <div className="mt-3 h-1.5 max-w-sm overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                            percentage === 100
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {percentage}% Ready
                        </span>

                        <Link
                          href={`/scholarships/${scholarship.id}`}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upload modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Add Document"
        subtitle="Select a document category and choose a file."
      >
        <form onSubmit={handleUpload} className="space-y-5">

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Document Category
            </label>

            <select
              value={selectedDocType}
              onChange={(e) =>
                setSelectedDocType(
                  e.target.value as DocumentItem['documentType']
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {DOC_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* File selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Select File
            </label>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-7 transition hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <Upload className="mb-2 h-6 w-6 text-indigo-600" />

              <span className="text-xs font-bold text-slate-700">
                {selectedFile
                  ? 'Choose a different file'
                  : 'Click to select a file'}
              </span>

              <span className="mt-1 text-[10px] text-slate-400">
                PDF, JPG or PNG · Maximum 10 MB
              </span>
            </button>

            {selectedFile && (
              <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-600"
                  title="Remove selected file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Notes <span className="font-normal text-slate-400">(Optional)</span>
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add issuing authority, expiry date, or other details..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Prototype note */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

            <p className="text-[10px] leading-relaxed text-amber-800">
              This prototype stores file metadata only. The actual file is
              not uploaded or saved. Verification status will remain pending
              until a real verification process is implemented.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFile(null);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedFile}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Save Document
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview details modal */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title="Document Details"
        subtitle="Review the information saved in your document vault."
        maxWidth="lg"
      >
        {previewDoc && (
          <div className="space-y-5">

            <div className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                <FileText className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {previewDoc.fileName}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {previewDoc.documentType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Document Category"
                value={previewDoc.documentType}
              />

              <DetailItem
                label="File Name"
                value={previewDoc.fileName}
              />

              <DetailItem
                label="File Size"
                value={previewDoc.fileSize}
              />

              <DetailItem
                label="File Format"
                value={getFileTypeLabel(previewDoc.fileType)}
              />

              <DetailItem
                label="Date Added"
                value={new Date(previewDoc.uploadedAt).toLocaleDateString(
                  'en-IN',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              />

              <DetailItem
                label="Verification Status"
                value={previewDoc.verified ? 'Verified' : 'Not verified'}
              />
            </div>

            {previewDoc.notes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Notes
                </p>

                <p className="text-xs leading-relaxed text-slate-700">
                  {previewDoc.notes}
                </p>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <p className="text-[10px] leading-relaxed text-amber-800">
                This is a metadata preview, not a preview of the original
                document. The actual file contents are not stored in this
                prototype.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Document"
        subtitle="Are you sure you want to remove this document record?"
      >
        {deleteTarget && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600">
                <Trash2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900">
                  {deleteTarget.fileName}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  {deleteTarget.documentType}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              This will remove the document record from your vault. This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                Delete Document
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

/* --------------------------------------------------
   Reusable Components
-------------------------------------------------- */

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'indigo' | 'blue' | 'amber' | 'emerald';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-[10px] text-slate-400">{description}</p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="break-words text-xs font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}