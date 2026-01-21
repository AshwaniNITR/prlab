"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

// Type definitions
interface Patent {
  id: string;
  title: string;
  ApplNo?: string;
  Status?: "Granted" | "Pending" | "First Evaluation Report Submitted" | string;
  Inventors?: string;
  FilingDate?: string;
  GrantDate?: string;
  data: Array<string>;
}

interface Journal {
  id: string;
  title: string;
  authors?: string;
  journal?: string;
  year?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  type?: string;
  status?: string;
}

interface Conference {
  id: string;
  title: string;
  authors?: string;
  conference?: string;
  year?: string;
  month?: string;
  pages?: string;
  location?: string;
  type?: string;
  status?: string;
}

type PublicationItem = Patent | Journal | Conference ;

type PublicationType = "patent" | "journal" | "conference"| "bookchapter";
let patentData: Patent[];

// Modal Component
const PublicationModal = ({
  item,
  type,
  isOpen,
  onClose,
}: {
  item: PublicationItem;
  type: PublicationType;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-white/80 bg-opacity-80 transition-opacity duration-300 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gray-300/50 border border-black animate-fade-in">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                    ${
                      type === "patent"
                        ? "bg-purple-100 text-purple-700"
                        : type === "journal"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {type}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 pr-8 leading-tight">
                  {item.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 text-xl"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              {type === "patent" && (
                <>
                  {(item as Patent).ApplNo && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Application No
                          </span>
                          <p className="text-gray-900 font-semibold truncate">
                            {(item as Patent).ApplNo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Patent).Status && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Status
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                (item as Patent).Status === "Granted"
                                  ? "bg-green-100 text-green-800"
                                  : (item as Patent).Status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {(item as Patent).Status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Patent).Inventors && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Inventors
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Patent).Inventors}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Patent).FilingDate && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Filing Date
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Patent).FilingDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Patent).GrantDate && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Grant Date
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Patent).GrantDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {type === "journal" && (
                <>
                  {(item as Journal).authors && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Authors
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).authors}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).journal && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Journal
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).journal}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).year && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Year
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).year}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {((item as Journal).volume || (item as Journal).issue) && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Volume/Issue
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).volume &&
                              `Vol. ${(item as Journal).volume}`}
                            {(item as Journal).volume &&
                              (item as Journal).issue &&
                              ", "}
                            {(item as Journal).issue &&
                              `Issue ${(item as Journal).issue}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).pages && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Pages
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).pages}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).type && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Type
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

               {type === "bookchapter" && (
                <>
                  {(item as Journal).authors && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Authors
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).authors}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).journal && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Journal
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).journal}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).year && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Year
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).year}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {((item as Journal).volume || (item as Journal).issue) && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Volume/Issue
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).volume &&
                              `Vol. ${(item as Journal).volume}`}
                            {(item as Journal).volume &&
                              (item as Journal).issue &&
                              ", "}
                            {(item as Journal).issue &&
                              `Issue ${(item as Journal).issue}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).pages && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Pages
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).pages}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Journal).type && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Type
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Journal).type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
 




              

              {type === "conference" && (
                <>
                  {(item as Conference).authors && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Authors
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).authors}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).conference && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Conference
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).conference}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).year && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Year
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).year}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).month && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Month
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).month}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).pages && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Pages
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).pages}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).location && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Location
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(item as Conference).type && (
                    <div className="flex items-center py-3 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-emerald-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            Type
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {(item as Conference).type}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3.5 rounded-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const Page = () => {
  const params = useParams();
  const pageType = params.slug as PublicationType;
  const [selectedItem, setSelectedItem] = useState<PublicationItem | null>(
    null
  );
  const [patents, setPatents] = useState<Patent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [yearFilters, setYearFilters] = useState<string[]>([]);
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        setIsLoading(true);
        const patentRes = await fetch("/api/patent");
        const response = await patentRes.json();

        if (response.success && Array.isArray(response.data)) {
          // Define a suitable type for the API item
          type PatentApiItem = {
            title?: string;
            ApplNo?: string;
            Status?: Patent["Status"];
            Inventors?: string;
            FilingDate?: string | number | null;
            GrantDate?: string;
          };

          // Transform the API data to match the Patent interface
          const transformedPatents: Patent[] = response.data.map(
            (item: PatentApiItem, index: number) => ({
              id: (index + 1).toString(),
              title: item.title || "",
              ApplNo: item.ApplNo,
              Status: item.Status,
              Inventors: item.Inventors,
              FilingDate: item.FilingDate
                ? new Date(String(item.FilingDate)).toLocaleDateString()
                : undefined,
              GrantDate: item.GrantDate,
              data: [],
            })
          );

          setPatents(transformedPatents);
        }
      } catch (error) {
        console.error("Error fetching patents:", error);
        setPatents([]);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchJournal = async () => {
      try {
        setIsLoading(true);
        const journalRes = await fetch("/api/journal");
        const response = await journalRes.json();

        if (response.success && Array.isArray(response.data)) {
          // Define a suitable type for the API item
          type JournalApiItem = {
            id: string;
            title: string;
            authors?: string;
            journal?: string;
            year?: string | number;
            volume?: string;
            issue?: string;
            pages?: string;
            type?: string;
            status?: string;
          };

          // Transform the API data to match the Journal interface
          const transformedJournals: Journal[] = response.data.map(
            (item: JournalApiItem, index: number) => ({
              id: (index + 1).toString(),
              title: item.title || "",
              authors: item.authors,
              journal: item.journal,
              year: item.year,
              volume: item.volume,
              issue: item.issue,
              pages: item.pages,
              type: item.type,
              status: item.status,
              data: [],
            })
          );

          setJournals(transformedJournals);
        }
      } catch (error) {
        console.error("Error fetching journals:", error);
        setJournals([]);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchConference = async () => {
      try {
        setIsLoading(true);
        const conferenceRes = await fetch("/api/conference");
        const response = await conferenceRes.json();
        if (response.success && Array.isArray(response.data)) {
          type ConferenceApiItem = {
            id: string;
            title: string;
            authors?: string;
            conference?: string;
            year?: string;
            month?: string;
            pages?: string;
            location?: string;
            type?: string;
            status?: string;
          };
          const transformedConferences: Conference[] = response.data.map(
            (item: ConferenceApiItem, index: number) => ({
              id: (index + 1).toString(),
              title: item.title || "",
              authors: item.authors,
              conference: item.conference,
              year: item.year,
              month: item.month,
              pages: item.pages,
              location: item.location,
              type: item.type,
              status: item.status,
              data: [],
            })
          );

          setConferences(transformedConferences);
        }
      } catch (error) {
        console.error("Error fetching conferences:", error);
        setConferences([]);
      } finally {
        setIsLoading(false);
      }
    }
    const fetchBookChapters=async()=>{
      try{
        setIsLoading(true);
        const bookChapterRes = await fetch("/api/journal");
        const response = await bookChapterRes.json();
        if (response.success && Array.isArray(response.data)) {
             const filteredRes = response.data.filter(
        (item: Journal) => item.type === "Book Chapter"
      );
           type JournalApiItem = {
            id: string;
            title: string;
            authors?: string;
            journal?: string;
            year?: string | number;
            volume?: string;
            issue?: string;
            pages?: string;
            type?: string;
            status?: string;
          };
           // Transform the API data to match the Journal interface
          const transformedJournals: Journal[] = filteredRes.map(
            (item: JournalApiItem, index: number) => ({
              id: (index + 1).toString(),
              title: item.title || "",
              authors: item.authors,
              journal: item.journal,
              year: item.year,
              volume: item.volume,
              issue: item.issue,
              pages: item.pages,
              type: item.type,
              status: item.status,
              data: [],
            })
          );

          setJournals(transformedJournals);    
        }
      }catch (error) {
        console.error("Error fetching Book Chapters:", error);
        setJournals([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (pageType === "patent") {
      fetchPatents();
    } else if (pageType === "journal") {
      fetchJournal();
    } else if (pageType === "conference") {
      fetchConference();
    }
    else if(pageType==="bookchapter"){
      fetchBookChapters();
    } else {
      setIsLoading(false);
    }
  }, [pageType]);
  const getDataArray = (): PublicationItem[] => {
    switch (pageType) {
      case "patent":
        return patents;
      case "journal":
        return journals;
      case "conference":
        return conferences;
      case "bookchapter":
        return journals;
      default:
        return [];
    }
  };

  const getTitle = (): string => {
    switch (pageType) {
      case "patent":
        return "Patents";
      case "journal":
        return "Journal Publications";
      case "conference":
        return "Conference Proceedings";
      case "bookchapter":
        return "Book Chapters";
      default:
        return "Publications";
    }
  };

  const getIcon = (): string => {
    switch (pageType) {
      case "patent":
        return "⚡";
      case "journal":
        return "📚";
      case "conference":
        return "🎤";
      case "bookchapter":
        return "📖";
      default:
        return "📄";
    }
  };

  const handleCardClick = (item: PublicationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const data = getDataArray();
  const title = getTitle();
  const icon = getIcon();

  // Card component
  const Card = ({
    item,
    type,
  }: {
    item: PublicationItem;
    type: PublicationType;
  }) => (
    <div
      onClick={() => handleCardClick(item)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-blue-100 hover:border-blue-300 cursor-pointer group"
    >
      {/* Header with icon and ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="text-2xl">{icon}</div>
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
          #{item.id}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-blue-900 mb-4 line-clamp-3 group-hover:text-blue-700 transition-colors">
        {item.title}
      </h3>

      {/* Preview info based on type */}
      <div className="space-y-2">
        {type === "patent" && (
          <>
            {(item as Patent).ApplNo && (
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium mr-2">App No:</span>
                <span className="text-gray-700 truncate">
                  {(item as Patent).ApplNo}
                </span>
              </div>
            )}
            {(item as Patent).Status && (
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium mr-2">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (item as Patent).Status === "Granted"
                      ? "bg-green-100 text-green-800"
                      : (item as Patent).Status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {(item as Patent).Status}
                </span>
              </div>
            )}
          </>
        )}

        {type === "journal" && (
          <>
            {(item as Journal).authors && (
              <div className="text-sm text-gray-600 line-clamp-1">
                {(item as Journal).authors}
              </div>
            )}
            {(item as Journal).year && (
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium mr-2">Year:</span>
                <span className="text-gray-700">{(item as Journal).year}</span>
              </div>
            )}
          </>
        )}
        {type === "bookchapter" && (
          <>
            {(item as Journal).authors && (
              <div className="text-sm text-gray-600 line-clamp-1">
                {(item as Journal).authors}
              </div>
            )}
            {(item as Journal).year && (
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium mr-2">Year:</span>
                <span className="text-gray-700">{(item as Journal).year}</span>
              </div>
            )}
          </>
        )}

        {type === "conference" && (
          <>
            {(item as Conference).conference && (
              <div className="text-sm text-gray-600 line-clamp-1">
                {(item as Conference).conference}
              </div>
            )}
            {(item as Conference).year && (
              <div className="flex items-center text-sm">
                <span className="text-blue-700 font-medium mr-2">Year:</span>
                <span className="text-gray-700">
                  {(item as Conference).year}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Click indicator */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-blue-600 font-medium">
          Click to view details
        </span>
        <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
          →
        </div>
      </div>
    </div>
  );

  // --- Helper functions for safe year extraction ---
  const extractYear = (v?: string | number | null): string | null => {
    if (!v) return null;
    const match = String(v).match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
  };

  const getItemYear = (item: PublicationItem): string | null => {
    if ("year" in item && item.year) return item.year; // Journals/Conferences
    if ("FilingDate" in item) {
      const y = extractYear(item.FilingDate);
      if (y) return y;
    }
    if ("GrantDate" in item) {
      const y = extractYear(item.GrantDate);
      if (y) return y;
    }
    return null;
  };

  const availableYears = Array.from(
    new Set(data.map(getItemYear).filter((y): y is string => Boolean(y)))
  ).sort((a, b) => Number(b) - Number(a));

  // Filter the data based on the search query
  const filteredData = data.filter((item) => {
    const matchesQuery = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());

    const year = getItemYear(item);
    const matchesYear =
      yearFilters.length === 0 || (year && yearFilters.includes(year));

    return matchesQuery && matchesYear;
  });

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
  {/* <Navbar /> */}
  
  {/* Animated background elements - adjusted for mobile */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 animate-pulse delay-1000"></div>
  </div>

  <div className="max-w-7xl mx-auto relative">
    {/* Header */}
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-2">
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-2">
        {title}
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-blue-700 max-w-2xl mx-auto font-medium px-2">
        Pattern Recognition and Machine Intelligence Laboratory
      </p>
    </div>

    {/* Results + Search Row */}
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 sm:mb-8">
      {/* Results count */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 border border-blue-100 w-full sm:w-auto">
        <p className="text-blue-800 font-semibold text-sm sm:text-base">
          Showing{" "}
          <span className="text-blue-600 font-bold">
            {filteredData.length}
          </span>{" "}
          {filteredData.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {/* Search + Year Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        {/* Search bar */}
        <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 w-full sm:w-64 md:w-72 lg:w-80">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 sm:p-2 transition-colors duration-300 flex-shrink-0"
            aria-label="Search"
          >
            <span className="text-sm sm:text-base">🔍</span>
          </button>
        </div>

        {/* Year Filter Button - relative container for dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowYearMenu(!showYearMenu)}
            className="bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-full shadow-sm transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            🗓️ Filter
          </button>

          {/* Dropdown Menu */}
          {showYearMenu && (
            <div className="absolute top-full sm:top-12 right-0 sm:right-0 mt-2 sm:mt-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-full sm:w-44 z-50 max-h-60 overflow-y-auto">
              {/* Clear All option */}
              <button
                onClick={() => setYearFilters([])}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                Clear All
              </button>
              <div className="border-t border-gray-200 my-1"></div>

              {/* All Years option */}
              <button
                onClick={() => {
                  setYearFilters([]);
                  setShowYearMenu(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-blue-100 ${
                  yearFilters.length === 0
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={yearFilters.length === 0}
                  readOnly
                  className="mr-2 accent-blue-600"
                />
                All Years
              </button>

              {/* Year list */}
              {availableYears.map((year) => {
                const isSelected = yearFilters.includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => {
                      setYearFilters(
                        (prev) =>
                          isSelected
                            ? prev.filter((y) => y !== year)
                            : [...prev, year]
                      );
                    }}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-blue-100 ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2 accent-blue-600"
                    />
                    {year}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Data Grid */}
    {isLoading ? (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-blue-500 border-solid mb-3 sm:mb-4"></div>
        <p className="text-blue-800 font-medium text-base sm:text-lg">Loading data...</p>
      </div>
    ) : filteredData.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {filteredData.map((item) => (
          <Card key={item.id} item={item} type={pageType} />
        ))}
      </div>
    ) : (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12 text-center border border-blue-100 mx-2 sm:mx-0">
        <div className="text-blue-300 mb-3 sm:mb-4">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
          No Data Found
        </h3>
        <p className="text-blue-700 text-sm sm:text-base">
          No {pageType} entries available at the moment.
        </p>
      </div>
    )}
  </div>

  {/* Modal */}
  {selectedItem && (
    <PublicationModal
      item={selectedItem}
      type={pageType}
      isOpen={isModalOpen}
      onClose={closeModal}
    />
  )}
</div>
  );
};

export default Page;
