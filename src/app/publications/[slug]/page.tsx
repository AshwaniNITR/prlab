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

type PublicationItem = Patent | Journal | Conference;

type PublicationType = "patent" | "journal" | "conference";
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
    };

    if (pageType === "patent") {
      fetchPatents();
    } else if (pageType === "journal") {
      fetchJournal();
    } else if (pageType === "conference") {
      fetchConference();
    } else {
      setIsLoading(false);
    }
  }, [pageType]);
  // Data arrays with proper typing
  //   const patents: Patent[] = [
  //   {
  //     id: "1",
  //     title: "An Integrated System to Acquire and Process Digital Heart Sound Signal for Identification of Valvular Heart Diseases with Training, Self-test, Report Generation and Display Facilities",
  //     ApplNo: "85/Kol/08",
  //     Status: "Granted",
  //     Inventors: "Goutam Saha, Samit Ari, and Suman Senapati",
  //     FilingDate: "10/01/08",
  //     GrantDate: "31/10/2019"
  //   },
  //   {
  //     id: "2",
  //     title: "GCROM: A system for surveillance mobile robot control using vision based static hand gesture recognition",
  //     ApplNo: "202131002191",
  //     Status: "Granted",
  //     Inventors: "Jaya Prakash Sahoo, and Samit Ari",
  //     FilingDate: "02 Feb 2021",
  //     GrantDate: "21/03/2025"
  //   },
  //   {
  //     id: "3",
  //     title: "A mobile based Cardiac Health Monitoring System using deep Residual Network",
  //     ApplNo: "202231071330",
  //     Status: "First Evaluation Report Submitted",
  //     Inventors: "Samit Ari, Allam Jaya Prakash and Sounak Samantray",
  //     FilingDate: "10 Dec 2022",
  //     GrantDate: "Pending"
  //   },
  //   {
  //     id: "4",
  //     title: "Unauthorized Person Detection using Thermal Imaging and Gait Recognition for Intra-Building Security",
  //     ApplNo: "202331058606",
  //     Status: "First Evaluation Report Submitted",
  //     Inventors: "Samit Ari, Mohammad Iman Junaid, Narayan Prasad Sharma and Irshad Ali",
  //     FilingDate: "31 August 2023",
  //     GrantDate: "Pending"
  //   }
  // ];
  //const patents=patentData;

  // const journals: Journal[] = [
  //   // ... your journals data
  // ];
  // const journals: Journal[] = [
  //   {
  //     id: "1",
  //     title:
  //       "Empirical wavelet transform and deep learning-based technique for ECG beat classification",
  //     authors: "A. J. Prakash and S. Ari",
  //     journal:
  //       "Advanced Methods in Biomedical Signal Processing and Analysis, Elsevier",
  //     year: "2022",
  //     pages: "109-128",
  //     type: "Book Chapter",
  //   },
  //   {
  //     id: "2",
  //     title:
  //       "Patient-specific ECG beat classification using EMD and deep learning-based technique",
  //     authors: "A. J. Prakash and S. Ari",
  //     journal:
  //       "Advanced Methods in Biomedical Signal Processing and Analysis, Elsevier",
  //     year: "2022",
  //     pages: "87-108",
  //     type: "Book Chapter",
  //   },
  //   {
  //     id: "3",
  //     title:
  //       "AdU-Net: Glacial lake extraction and outburst risk assessment using satellite imagery",
  //     authors: "J. Thati, A. J. Prakash, and S. Ari",
  //     journal: "IEEE Transactions on Artificial Intelligence",
  //     year: "2025",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "4",
  //     title:
  //       "MalNet-DAF: Dual-attentive fusion deep learning model for malaria parasite classification",
  //     authors:
  //       "K. K. Patro, A. J. Prakash, S. Madarapu, S. Ari, S. Routray, A. Mukherjee, and S. Mishra",
  //     journal: "IEEE Journal of Biomedical and Health Informatics",
  //     year: "2025",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "5",
  //     title:
  //       "AFMNet: Adaptive feature modulation network for classification of white blood cells",
  //     authors: "S. Aryal, S. K. Naik, S. Madarapu, and S. Ari",
  //     journal: "Biocybernetics and Biomedical Engineering",
  //     year: "2025",
  //     volume: "45",
  //     issue: "3",
  //     pages: "539-548",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "6",
  //     title:
  //       "HLS-compiled PYNQ-based cardiac arrhythmia detection system leveraging quantized ECG beat images",
  //     authors: "S. Mangaraj, K. Mahapatra, and S. Ari",
  //     journal: "Biomedical Signal Processing and Control",
  //     year: "2025",
  //     volume: "109",
  //     pages: "108063",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "7",
  //     title:
  //       "CRA-Net: Cross reverse attention network for classification of neuro-degenerative diseases based on gait analysis",
  //     authors: "D. Bodepu, M. I. Junaid, S. Madarapu, J. P. Sahoo, and S. Ari",
  //     journal: "Biomedical Signal Processing and Control",
  //     year: "2025",
  //     volume: "108",
  //     pages: "107886",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "8",
  //     title:
  //       "Human gait recognition using dense residual network and hybrid attention technique with back-flow mechanism",
  //     authors: "M. I. Junaid, S. Madarapu, and S. Ari",
  //     journal: "Digital Signal Processing",
  //     year: "2025",
  //     pages: "105401",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "9",
  //     title:
  //       "Diabetic retinopathy grading based on multi-scale residual network and cross-attention module",
  //     authors: "A. K. Singh, S. Madarapu, and S. Ari",
  //     journal: "Digital Signal Processing",
  //     year: "2025",
  //     volume: "157",
  //     pages: "104888",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "10",
  //     title:
  //       "Human gait recognition using attention based convolutional network with sequential learning",
  //     authors: "M. I. Junaid, S. Madarapu, and S. Ari",
  //     journal: "Signal, Image and Video Processing (SIViP)",
  //     year: "2025",
  //     volume: "19",
  //     pages: "157",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "11",
  //     title:
  //       "Human gait recognition using joint spatiotemporal modulation in deep convolutional neural networks",
  //     authors: "M. I. Junaid, J. P. Allam, S. Ari",
  //     journal: "Journal of Visual Communication and Image Representation",
  //     year: "2024",
  //     volume: "105",
  //     pages: "104322",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "12",
  //     title:
  //       "C2x-FNet: Cascaded Dense Block with Two-fold Cross Feature Enhancement Module for Diabetic Retinopathy Grading",
  //     authors: "S. Madarapu, S. Ari, and K. Mahapatra",
  //     journal: "IEEE Transactions on Instrumentation and Measurement",
  //     year: "2024",
  //     status: "Accepted",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "13",
  //     title:
  //       "DFCAFNet: Dual-feature co-attentive fusion network for diabetic retinopathy grading",
  //     authors: "S. Madarapu, S. Ari, and K. Mahapatra",
  //     journal: "Biomedical Signal Processing and Control",
  //     year: "2024",
  //     volume: "96",
  //     pages: "106564",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "14",
  //     title:
  //       "A Multi-Resolution Convolutional Attention Network for Efficient Diabetic Retinopathy Classification",
  //     authors: "S. Madarapu, S. Ari, and Kamalakanta Mahapatra",
  //     journal: "Computers and Electrical Engineering",
  //     year: "2024",
  //     volume: "117",
  //     pages: "109243",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "15",
  //     title:
  //       "Multi-stream Bi-GRU network to extract a comprehensive feature set for ECG signal classification",
  //     authors: "J. P. Allam, S. P. Sahoo, and S. Ari",
  //     journal: "Biomedical Signal Processing and Control",
  //     year: "2024",
  //     volume: "92",
  //     pages: "106097",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "16",
  //     title:
  //       "A deep integrative approach for diabetic retinopathy classification with synergistic channel-spatial and self-attention mechanism",
  //     authors: "S. Madarapu, S. Ari, and K. K. Mahapatra",
  //     journal: "Expert Systems with Applications",
  //     year: "2024",
  //     volume: "123",
  //     pages: "523",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "17",
  //     title:
  //       "DUNet: Dual U-Net Architecture for Ocean Eddies Detection and Tracking",
  //     authors: "S. J. Saida and S. Ari",
  //     journal:
  //       "IEEE Transactions on Emerging Topics in Computational Intelligence",
  //     year: "2024",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "18",
  //     title:
  //       "Deep convolution neural network based semantic segmentation for ocean eddy detection",
  //     authors: "S. J. Saida, S. P. Sahoo, and S. Ari",
  //     journal: "Expert Systems with Applications",
  //     year: "2023",
  //     volume: "219",
  //     pages: "119646",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "19",
  //     title:
  //       "DeReFNet: Dual-stream Dense Residual Fusion Network for static hand gesture recognition",
  //     authors: "J. P. Sahoo, S. P. Sahoo, S. Ari, and S. K. Patra",
  //     journal: "Displays",
  //     year: "2023",
  //     volume: "77",
  //     pages: "102388",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "20",
  //     title:
  //       "Hand Gesture Recognition Using Densely Connected Deep Residual Network and Channel Attention Module for Mobile Robot Control",
  //     authors: "J. P. Sahoo, S. P. Sahoo, S. Ari, and S. K. Patra",
  //     journal: "IEEE Transactions on Instrumentation and Measurement",
  //     year: "2023",
  //     volume: "72",
  //     pages: "1-11",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "21",
  //     title:
  //       "A deformable CNN architecture for predicting clinical acceptability of ECG signal",
  //     authors: "A. Jaya Prakash, S. Samantray, S. P. Sahoo, and S. Ari",
  //     journal: "Biocybernetics and Biomedical Engineering",
  //     year: "2023",
  //     volume: "43",
  //     issue: "1",
  //     pages: "335-351",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "22",
  //     title:
  //       "MU-net: modified U-net architecture for automatic ocean Eddy detection",
  //     authors: "S. J. Saida, and S. Ari",
  //     journal: "IEEE Geoscience and Remote Sensing Letters",
  //     year: "2022",
  //     volume: "19",
  //     pages: "1-5",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "23",
  //     title:
  //       "DISNet: A sequential learning framework to handle occlusion in human action recognition with video acquisition sensors",
  //     authors: "S. P. Sahoo, S. Modalavalasa, and S. Ari",
  //     journal: "Digital Signal Processing",
  //     year: "2022",
  //     volume: "131",
  //     pages: "103763",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "24",
  //     title:
  //       "GLeSI: A system for extraction of glacial lakes using satellite imagery",
  //     authors: "J. Thati, and S. Ari",
  //     journal: "Concurrency and Computation: Practice and Experience",
  //     year: "2022",
  //     volume: "34",
  //     issue: "23",
  //     pages: "e7184",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "25",
  //     title:
  //       "A systematic extraction of glacial lakes for satellite imagery using deep learning based technique",
  //     authors: "J. Thati, and S. Ari",
  //     journal: "Measurement",
  //     year: "2022",
  //     volume: "192",
  //     pages: "110858",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "26",
  //     title:
  //       "RBI-2RCNN: Residual Block Intensity Feature using a Two-stage Residual Convolutional Neural Network for Static Hand Gesture Recognition",
  //     authors: "J. P. Sahoo, S. P. Sahoo, S. Ari, and S. K. Patra",
  //     journal: "Signal Image and Video processing",
  //     year: "2022",
  //     volume: "16",
  //     issue: "8",
  //     pages: "2019-27",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "27",
  //     title:
  //       "Brain-Computer Interface Speller System for Alternative Communication: A Review",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "Innovation and Research in BioMedical engineering (IRBM)",
  //     year: "2021",
  //     volume: "43",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "28",
  //     title:
  //       "Radix-8 Modified Booth Fixed-Width Signed Multipliers with Error Compensation",
  //     authors: "G. R. Locharla, K. K. Mahapatra, and S. Ari",
  //     journal: "Arabian Journal for Science and Engineering",
  //     year: "2021",
  //     volume: "46",
  //     issue: "2",
  //     pages: "1115-1125",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "29",
  //     title:
  //       "SpEC: A system for patient specific ECG beat classification using deep residual network",
  //     authors: "A. Jaya Prakash, S. Samatray, and S. Ari",
  //     journal: "Biocybernetics and Biomedical Engineering",
  //     year: "2021",
  //     volume: "40",
  //     issue: "4",
  //     pages: "1446-1457",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "30",
  //     title:
  //       "AR-Depth: A Novel Framework for Human Action Recognition Using Sequential Learning and Depth Estimated History Images",
  //     authors: "S. P. Sahoo, S. Ari, K. K. Mahapatra, and S. P. Mohanty",
  //     journal:
  //       "IEEE Transactions on Emerging Topics in Computational Intelligence",
  //     year: "2020",
  //     volume: "5",
  //     issue: "5",
  //     pages: "813-25",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "31",
  //     title:
  //       "Change Detection in Landsat Images using Unsupervised Learning and Multilevel Clustering",
  //     authors: "N. Gupta, S. Ari, and N. Panigrahi",
  //     journal:
  //       "IEEE Transactions on Emerging Topics in Computational Intelligence",
  //     year: "2019",
  //     volume: "5",
  //     issue: "2",
  //     pages: "284-97",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "32",
  //     title:
  //       "MsCNN: A Deep Learning Framework for P300 Based Brain-Computer Interface Speller",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "IEEE Transactions on Medical Robotics and Bionics",
  //     year: "2019",
  //     volume: "2",
  //     issue: "1",
  //     pages: "86-93",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "33",
  //     title:
  //       "P300 based character recognition using sparse autoencoder with ensemble of SVMs",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "Biocybernetics and Biomedical Engineering",
  //     year: "2019",
  //     volume: "39",
  //     issue: "4",
  //     pages: "956-966",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "34",
  //     title:
  //       "A Deep Learning Architecture for P300 Detection with Brain-Computer Interface Application",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "Innovation and Research in BioMedical engineering (IRBM)",
  //     year: "2019",
  //     volume: "41",
  //     issue: "1",
  //     pages: "31-8",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "35",
  //     title:
  //       "P300 based character recognition using convolutional neural network and support vector machine",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "Biomedical Signal Processing and Control",
  //     year: "2019",
  //     volume: "55",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "36",
  //     title:
  //       "An overview of the research work on multispectral imaging, hand gesture recognition, EEG and ECG signal processing",
  //     authors: "S. Ari",
  //     journal: "CSI Transactions on ICT",
  //     year: "2019",
  //     volume: "7",
  //     issue: "2",
  //     pages: "75-79",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "37",
  //     title:
  //       "3D Features for Human Action Recognition with Semi-Supervised Learning",
  //     authors: "S. P. Sahoo, U. Srinivasu, and S. Ari",
  //     journal: "IET Image Processing",
  //     year: "2019",
  //     volume: "13",
  //     issue: "6",
  //     pages: "983-990",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "38",
  //     title: "On an algorithm for Human Action Recognition",
  //     authors: "S. P. Sahoo, and S. Ari",
  //     journal: "Expert Systems with Applications",
  //     year: "2019",
  //     volume: "115",
  //     pages: "524-534",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "39",
  //     title:
  //       "Change detection in Landsat images based on local neighborhood information",
  //     authors: "N. Gupta, G. V. Pillai and S. Ari",
  //     journal: "IET Image Processing",
  //     year: "2018",
  //     volume: "12",
  //     issue: "11",
  //     pages: "2051-2058",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "40",
  //     title:
  //       "Hand Gesture Recognition using DWT and F-ratio Based Feature Descriptor",
  //     authors: "J. P. Sahoo, S. Ari, and D. K. Ghosh",
  //     journal: "IET Image Processing",
  //     year: "2018",
  //     volume: "12",
  //     issue: "10",
  //     pages: "1780-1787",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "41",
  //     title:
  //       "Change Detection in Optical Satellite Images Based on Local Binary Similarity Pattern Technique",
  //     authors: "N. Gupta, G. V. Pillai and S. Ari",
  //     journal: "IEEE Geoscience and Remote Sensing Letters",
  //     year: "2018",
  //     volume: "15",
  //     issue: "3",
  //     pages: "389-393",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "42",
  //     title:
  //       "P300 detection with brain-computer interface application using PCA and ensemble of weighted SVMs",
  //     authors: "S. Kundu, and S. Ari",
  //     journal: "IETE Journal of research",
  //     year: "2018",
  //     volume: "64",
  //     issue: "3",
  //     pages: "406-414",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "43",
  //     title:
  //       "Variable length mixed radix MDC FFT/IFFT processor for MIMO-OFDM application",
  //     authors: "G. R. Locharla, K. K. Mahapatra, and S. Ari",
  //     journal: "IET Computers & Digital Techniques",
  //     year: "2017",
  //     volume: "12",
  //     issue: "1",
  //     pages: "9-19",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "44",
  //     title:
  //       "Implementation of MIMO data reordering and scheduling methodologies for eight-parallel variable length multi-path delay commutator FFT/IFFT",
  //     authors: "G. R. Locharla, S. K. Kallur, K. K. Mahapatra, and S. Ari",
  //     journal: "IET Computers & Digital Techniques",
  //     year: "2016",
  //     volume: "10",
  //     issue: "5",
  //     pages: "215-225",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "45",
  //     title: "On an algorithm for Vision-based hand gesture recognition",
  //     authors: "D. K. Ghosh, and S. Ari",
  //     journal: "Signal, Image and Video Processing",
  //     year: "2016",
  //     volume: "10",
  //     issue: "4",
  //     pages: "655-662",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "46",
  //     title:
  //       "Automatic ECG arrhythmia classification using dual tree complex wavelet based features",
  //     authors: "M. Thomas, M. K. Das, and S. Ari",
  //     journal: "AEU-International Journal of Electronics and Communications",
  //     year: "2015",
  //     volume: "69",
  //     issue: "4",
  //     pages: "715-721",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "47",
  //     title: "Static Hand Gesture Recognition Based on Fusion of Moments",
  //     authors: "S. Chatterjee, D. K. Ghosh, and S. Ari",
  //     journal: "Intelligent Computing, Communication and Devices",
  //     year: "2015",
  //     volume: "2",
  //     pages: "429-434",
  //     type: "Book Chapter",
  //   },
  //   {
  //     id: "48",
  //     title:
  //       "Electrocardiogram beat classification using S-transform based feature set",
  //     authors: "M. K. Das, and S. Ari",
  //     journal: "Journal of Mechanics in Medicine and Biology",
  //     year: "2014",
  //     volume: "14",
  //     issue: "05",
  //     pages: "1450066",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "49",
  //     title: "Patient-specific ECG beat classification technique",
  //     authors: "M. K. Das, and S. Ari",
  //     journal: "Healthcare technology letters, IET",
  //     year: "2014",
  //     volume: "1",
  //     issue: "3",
  //     pages: "98-103",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "50",
  //     title: "ECG beats classification using mixture of features",
  //     authors: "M. K. Das, and S. Ari",
  //     journal: "International Scholarly Research Notices, Hindawi",
  //     year: "2014",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "51",
  //     title: "Edge detection using ACO and F ratio",
  //     authors: "S. Ari, D. K. Ghosh, and P. K. Mohanty",
  //     journal: "Signal, Image and Video Processing",
  //     year: "2014",
  //     volume: "8",
  //     issue: "4",
  //     pages: "625-634",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "52",
  //     title:
  //       "Autocorrelation and Hilbert transform-based QRS complex detection in ECG signal",
  //     authors: "J. P. Sahoo, M. K. Das, S. Ari, and S. Behera",
  //     journal:
  //       "International Journal of Signal and Imaging Systems Engineering",
  //     year: "2024",
  //     volume: "7",
  //     issue: "1",
  //     pages: "52-58",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "53",
  //     title:
  //       "ECG signal analysis for detection of Heart Rate and Ischemic Episodes",
  //     authors: "G. K. Sahoo, S. Ari, and S. K. Patra",
  //     journal: "International Journal of Advanced Computer Research",
  //     year: "2013",
  //     volume: "3",
  //     issue: "1",
  //     pages: "148-152",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "54",
  //     title: "Analysis of ECG signal denoising method based on S-transform",
  //     authors: "M. K. Das, and S. Ari",
  //     journal: "Innovation and Research in BioMedical engineering (IRBM)",
  //     year: "2013",
  //     volume: "34",
  //     issue: "6",
  //     pages: "362-370",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "55",
  //     title: "ECG signal enhancement using S-Transform",
  //     authors: "S. Ari, M. K. Das, and A. Chacko",
  //     journal: "Computers in biology and medicine",
  //     year: "2013",
  //     volume: "43",
  //     issue: "6",
  //     pages: "649-660",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "56",
  //     title:
  //       "Detection of cardiac abnormality from PCG signal using LMS based least square SVM classifier",
  //     authors: "S. Ari, K. Hembram, and G. Saha",
  //     journal: "Expert Systems with Applications",
  //     year: "2010",
  //     volume: "37",
  //     pages: "8019-8026",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "57",
  //     title:
  //       "In search of an optimization technique for Artificial Neural Network to classify abnormal heart sounds",
  //     authors: "S. Ari and G. Saha",
  //     journal: "Applied Soft Computing journal",
  //     year: "2009",
  //     volume: "9",
  //     pages: "330-340",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "58",
  //     title:
  //       "Classification of Heart Sounds using Empirical Mode Decomposition based features",
  //     authors: "S. Ari and G. Saha",
  //     journal: "International Journal of Medical Engineering and Informatics",
  //     year: "2008",
  //     volume: "1",
  //     issue: "1",
  //     pages: "91-108",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "59",
  //     title:
  //       "DSP implementation of heart valve disorder detection system from phonocardiogram signal",
  //     authors: "S. Ari, K. Sensharma, and G. Saha",
  //     journal: "Journal of Medical Engineering & Technology",
  //     year: "2008",
  //     volume: "32",
  //     issue: "2",
  //     pages: "122-132",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "60",
  //     title:
  //       "A Robust Heart Sound Segmentation Algorithm for Commonly Occurring Heart Valve Diseases",
  //     authors: "S. Ari, P. Kumar, and G. Saha",
  //     journal: "Journal of Medical Engineering & Technology",
  //     year: "2008",
  //     volume: "32",
  //     issue: "6",
  //     pages: "456-465",
  //     type: "International Journal",
  //   },
  //   {
  //     id: "61",
  //     title: "On A Robust Algorithm for Heart Sound Segmentation",
  //     authors: "S. Ari and G. Saha",
  //     journal: "Journal of Mechanics in Medicine and Biology",
  //     year: "2007",
  //     volume: "7",
  //     issue: "2",
  //     pages: "129-150",
  //     type: "International Journal",
  //   },
  // ];

  // const conferences: Conference[] = [
  //   {
  //     id: "1",
  //     title:
  //       "PACAC: PYNQ Accelerated Cardiac Arrhythmia Classifier with secure transmission-A Deep Learning based Approach",
  //     authors:
  //       "Mangaraj, S., Mohanty, J.P., Ari, S., Swain, A.K. and Mahapatra, K.",
  //     conference: "Proceedings of the Great Lakes Symposium on VLSI 2024",
  //     year: "2024",
  //     pages: "670-675",
  //     month: "June",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "2",
  //     title:
  //       "Deep Learning Technique for Extraction of Glacial Lakes Using Satellite Imagery",
  //     authors: "Thati, J. and Ari, S.",
  //     conference:
  //       "2024 IEEE Students Conference on Engineering and Systems (SCES)",
  //     year: "2024",
  //     pages: "1-6",
  //     month: "June",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "3",
  //     title:
  //       "FPGA Accelerated Convolutional Neural Network for Detection of Cardiac Arrhythmia",
  //     authors: "Mangaraj S, Oraon P, Ari S, Swain AK, Mahapatra K.",
  //     conference:
  //       "2024 IEEE 4th International Conference on VLSI Systems, Architecture, Technology and Applications (VLSI SATA)",
  //     year: "2024",
  //     pages: "1-6",
  //     month: "May",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "4",
  //     title: "Fusion of Multi-Scale CNN for Motor Imagery EEG Classification",
  //     authors: "Devi K S, Ari S",
  //     conference:
  //       "2nd International Conference on Computer, Electronics, Electrical Engineering and Their Applications (IC2E3-2024)",
  //     year: "2024",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "5",
  //     title:
  //       "Early Diagnosis of Parkinson's Disease and Severity Assessment based on Gait using 1D-CNN",
  //     authors: "Sharma, N. P., Junaid, I., & Ari, S.",
  //     conference:
  //       "2023 2nd International Conference on Smart Technologies and Systems for Next Generation Computing (ICSTSN)",
  //     year: "2023",
  //     pages: "1-6",
  //     month: "April",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "6",
  //     title: "VGG-16 based Gait Recognition using Skeleton Features",
  //     authors: "Ali, I., Junaid, I., & Ari, S.",
  //     conference:
  //       "2023 International Conference on Device Intelligence, Computing and Communication Technologies (DICCT)",
  //     year: "2023",
  //     pages: "597-601",
  //     month: "March",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "7",
  //     title:
  //       "A Systematic Extraction and Outburst Susceptibility Assessment of Glacial lakes in High Mountain Regions using Landsat 8 Imagery",
  //     authors: "Thati, J., & Ari, S.",
  //     conference:
  //       "2023 2nd International Conference on Computational Systems and Communication (ICCSC)",
  //     year: "2023",
  //     pages: "1-5",
  //     month: "March",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "8",
  //     title:
  //       "Surface Electromyography based Hand Gesture Signal Classification using 1D CNN",
  //     authors: "Krishnapriya, S., Sahoo, J. P., & Ari, S.",
  //     conference:
  //       "2023 International Conference on Intelligent Systems, Advanced Computing and Communication (ISACC)",
  //     year: "2023",
  //     pages: "1-6",
  //     month: "February",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "9",
  //     title:
  //       "A Light Weight Deep Learning based Technique for Patient-Specific ECG Beat Classification",
  //     authors: "Prakash, A. J., Samantray, S., & Ari, S.",
  //     conference:
  //       "2022 International Conference on Recent Trends in Microelectronics, Automation, Computing and Communications Systems (ICMACC)",
  //     year: "2022",
  //     pages: "250-254",
  //     month: "December",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "10",
  //     title:
  //       "A Deep Learning based Hybrid Model for Classification of Diabetic Retinopathy",
  //     authors: "Madarapu, S., Ari, S., & Mahapatra, K.",
  //     conference:
  //       "2022 6th International Conference on Computation System and Information Technology for Sustainable Solutions (CSITSS)",
  //     year: "2022",
  //     pages: "1-6",
  //     month: "December",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "11",
  //     title:
  //       "Design and FPGA Implementation of the LUT based Sigmoid Function for DNN Applications",
  //     authors: "Pogiri, R., Ari, S., & Mahapatra, K. K.",
  //     conference:
  //       "2022 IEEE International Symposium on Smart Electronic Systems (iSES)",
  //     year: "2022",
  //     pages: "410-413",
  //     month: "December",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "12",
  //     title:
  //       "Gait Identification using Deep Convolutional Network and Attention Technique",
  //     authors: "Junaid, I., Ali, I., Sharma, N. P., & Ari, S.",
  //     conference:
  //       "2022 IEEE 6th International Conference on Condition Assessment Techniques in Electrical Systems (CATCON)",
  //     year: "2022",
  //     pages: "334-338",
  //     month: "December",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "13",
  //     title:
  //       "Vision-based Static Hand Gesture Recognition using Dense-block Features and SVM classifier",
  //     authors: "Sahoo, J. P., Ari, S., & Patra, S. K.",
  //     conference:
  //       "2022 IEEE 2nd International Symposium on Sustainable Energy, Signal Processing and Cyber Security (iSSSC)",
  //     year: "2022",
  //     pages: "1-6",
  //     month: "December",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "14",
  //     title: "Gait Identification using Ensemble Deep Learning Technique",
  //     authors: "Junaid, M. I., & Ari, S.",
  //     conference: "2022 IEEE Silchar Subsection Conference (SILCON)",
  //     year: "2022",
  //     pages: "1-5",
  //     month: "November",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "15",
  //     title:
  //       "Dilated Convolution based U-Net Architecture for Ocean Eddy Detection",
  //     authors: "Saida, S. J., & Ari, S.",
  //     conference: "2022 IEEE Silchar Subsection Conference (SILCON)",
  //     year: "2022",
  //     pages: "1-5",
  //     month: "November",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "16",
  //     title:
  //       "Motor Imagery based EEG Signal Classification using Multi-scale CNN Architecture",
  //     authors: "Pratyusha, K., Devi, K. S., & Ari, S.",
  //     conference:
  //       "2022 International Conference on Signal and Information Processing (IConSIP)",
  //     year: "2022",
  //     pages: "1-5",
  //     month: "August",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "17",
  //     title:
  //       "Gait Recognition under Different Covariate Conditions using Deep Learning Technique",
  //     authors: "I. Junaid and S. Ari",
  //     conference:
  //       "IEEE International Conference on Signal Processing and Communications (SPCOM)",
  //     year: "2022",
  //     status: "Accepted",
  //     month: "July",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "18",
  //     title:
  //       "Automatic Detection of Ocean Eddy based on Deep Learning Technique with Attention Mechanism",
  //     authors: "S. J. Saida and S. Ari",
  //     conference: "IEEE 28th National Conference on Communication (NCC)",
  //     year: "2022",
  //     status: "Accepted and presented",
  //     type: "National Conference",
  //   },
  //   {
  //     id: "19",
  //     title:
  //       "Surface Electromyographic Hand Gesture Signal Classification Using a Set of Time-domain Features",
  //     authors: "S. Krishnapriya, J. P. Sahoo, and S. Ari",
  //     conference:
  //       "4th International Conference on Machine Intelligence and Signal Processing (MISP)",
  //     year: "2022",
  //     status: "Accepted and presented",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "20",
  //     title:
  //       "A novel unsupervised thresholding technique for landsat image change detection",
  //     authors: "N. Gupta, S. Ari, and A.K. Mishra",
  //     conference:
  //       "Twelfth Indian Conference on Computer Vision, Graphics and Image Processing",
  //     year: "2021",
  //     pages: "1-9",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "21",
  //     title:
  //       "A Three Stream Deep Network on Extracted Projected Planes for Human Action Recognition",
  //     authors: "S. P. Sahoo and S. Ari",
  //     conference:
  //       "IEEE International Conference on Computer, Electrical & Communication Engineering (ICCECE)",
  //     year: "2020",
  //     pages: "1-5",
  //     month: "January",
  //     location: "Kolkata, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "22",
  //     title:
  //       "AAMI Standard Cardiac Arrhythmia Detection with Random Forest Using Mixed Features",
  //     authors: "A. J. Prakash and S. Ari",
  //     conference:
  //       "2019 IEEE 16th India Council International Conference (INDICON)",
  //     year: "2019",
  //     pages: "1-4",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "23",
  //     title:
  //       "Hand Gesture Recognition using PCA based Deep CNN Reduced Features and SVM classifier",
  //     authors: "J. P. Sahoo, S. Ari and S. K. Patra",
  //     conference:
  //       "IEEE International Symposium on Smart Electronic Systems (IEEE-iSES)",
  //     year: "2019",
  //     pages: "221-224",
  //     month: "December",
  //     location: "Rourkela, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "24",
  //     title:
  //       "Fusion of Convolutional Neural Networks for P300 based Character Recognition",
  //     authors: "S. Kundu, and S. Ari",
  //     conference:
  //       "18th international conference on information technology (ICIT)",
  //     year: "2019",
  //     pages: "155-159",
  //     month: "December",
  //     location: "Bhubaneswar, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "25",
  //     title:
  //       "Spatial Neighborhood Mutual Information based Satellite Image Change Detection",
  //     authors: "N. Gupta, and S. Ari",
  //     conference:
  //       "5th International Conference on Convergence in Technology (I2CT)",
  //     year: "2019",
  //     pages: "1-5",
  //     month: "March",
  //     location: "Pune, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "26",
  //     title:
  //       "Feature Fusion based Unsupervised Change Detection in Optical Satellite Images",
  //     authors: "N. Gupta, P. Singh and S. Ari",
  //     conference:
  //       "5th International Conference on Convergence in Technology (I2CT)",
  //     year: "2019",
  //     pages: "1-5",
  //     month: "March",
  //     location: "Pune, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "27",
  //     title: "Fusion of histogram based features for Human Action Recognition",
  //     authors: "S. P. Sahoo, R. Silambarasi, and S. Ari",
  //     conference:
  //       "5th International Conference on Advanced Computing & Communication Systems (ICACCS)",
  //     year: "2019",
  //     pages: "1012-1016",
  //     month: "March",
  //     location: "Coimbatore, Tamilnadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "28",
  //     title:
  //       "Change Detection in Multispectral Satellite Images using Histogram based Thresholding Technique",
  //     authors: "P. Chandra Kanth, N. Gupta, and S. Ari",
  //     conference:
  //       "2019 Third IEEE International Conference on Electrical, Computer and Communication Technologies (ICECCT)",
  //     year: "2019",
  //     pages: "1-5",
  //     month: "February",
  //     location: "Coimbatore, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "29",
  //     title:
  //       "P300 Detection using Ensemble of SVM for Brain-Computer Interface Application",
  //     authors: "S. Kundu, and S. Ari",
  //     conference:
  //       "9th International conference on computing, communication and networking technologies (ICCCNT)",
  //     year: "2018",
  //     pages: "1-5",
  //     month: "July",
  //     location: "Bengaluru, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "30",
  //     title:
  //       "Hand Gesture Recognition Using Local Histogram Feature Descriptor",
  //     authors: "D. A. Reddy, J.P. Sahoo, S. Ari",
  //     conference:
  //       "2nd International Conference on trends in electronics and informatics (ICOEI)",
  //     year: "2018",
  //     pages: "199-203",
  //     month: "May",
  //     location: "Tamil Nadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "31",
  //     title:
  //       "Semi-Supervised Learning in Random Forest Classifier for Human Action Recognition",
  //     authors: "U. Srinivasu, S.P. Sahoo, S. Ari",
  //     conference:
  //       "2nd International conference on trends in electronics and informatics (ICOEI)",
  //     year: "2018",
  //     pages: "237-241",
  //     month: "May",
  //     location: "Tamil Nadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "32",
  //     title: "Score normalization of ensemble SVMs for BCI P300 speller",
  //     authors: "S. Kundu, and S. Ari",
  //     conference:
  //       "8th International conference on computing, communication and networking technologies (ICCCNT)",
  //     year: "2017",
  //     pages: "1-5",
  //     location: "Delhi, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "33",
  //     title:
  //       "3D Spatial-Temporal View Based Motion Tracing in Human Action Recognition",
  //     authors: "R. Silambarasi, S. P. Sahoo, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Communications and Signal Processing (ICCSP)",
  //     year: "2017",
  //     pages: "750-754",
  //     month: "April",
  //     location: "Chennai, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "34",
  //     title:
  //       "Unsupervised Change Detection in Optical Satellite Images using Binary Descriptor",
  //     authors: "N. Gupta, G. V. Pillai, and S. Ari",
  //     conference:
  //       "International Conference on Wireless Communications, Signal Processing and Networking (WiSPNET)",
  //     year: "2017",
  //     pages: "750-754",
  //     month: "March",
  //     location: "Chennai, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "35",
  //     title:
  //       "Descriptors based Unsupervised Change Detection in Satellite Images",
  //     authors: "G. V. Pillai, N. Gupta, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Communications and Signal Processing (ICCSP)",
  //     year: "2017",
  //     pages: "1629-1633",
  //     month: "April",
  //     location: "Chennai, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "36",
  //     title:
  //       "Implementation of input data buffering and scheduling methodology for 8 parallel MDC FFT",
  //     authors: "G. R. Locharla, S. K. Kallur, K. K. Mahapatra, and S. Ari",
  //     conference:
  //       "IEEE 19th International Symposium on VLSI Design and Test (VDAT)",
  //     year: "2015",
  //     pages: "1-6",
  //     month: "June",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "37",
  //     title:
  //       "Static Hand Gesture Recognition Using Mixture of Features and SVM Classifier",
  //     authors: "D. K. Ghosh, and S. Ari",
  //     conference:
  //       "IEEE Fifth International Conference on Communication Systems and Network Technologies (CSNT)",
  //     year: "2015",
  //     pages: "1094-1099",
  //     month: "April",
  //     location: "Gwalior, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "38",
  //     title: "Automated human tracking using advanced mean shift algorithm",
  //     authors: "S. P. Sahoo, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Communications and Signal Processing (ICCSP)",
  //     year: "2015",
  //     pages: "0789-0793",
  //     month: "April",
  //     location: "Chennai, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "39",
  //     title: "Performance evaluation of ECG compression techniques",
  //     authors: "G. K. Sahoo, S. Ari, and S. K. Patra",
  //     conference:
  //       "IEEE International Conference on Electrical, Computer and Communication Technologies (ICECCT)",
  //     year: "2015",
  //     pages: "1-5",
  //     month: "March",
  //     location: "Coimbatore, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "40",
  //     title:
  //       "Classification of cardiac arrhythmias based on dual tree complex wavelet transform",
  //     authors: "M. Thomas, M. K. Das, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Communications and Signal Processing (ICCSP)",
  //     year: "2014",
  //     pages: "729-733",
  //     month: "April",
  //     location: "Tamilnadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "41",
  //     title:
  //       "ECG arrhythmia recognition using artificial neural network with S-transform based effective features",
  //     authors: "M. K. Das, and S. Ari",
  //     conference: "Annual IEEE India Conference (INDICON)",
  //     year: "2013",
  //     pages: "1-6",
  //     month: "December",
  //     location: "Mumbai, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "42",
  //     title:
  //       "Electrocardiogram signal classification using s-transform, genetic algorithm and neural network",
  //     authors: "M. K. Das, D. K. Ghosh, and S. Ari",
  //     conference:
  //       "IEEE 1st International Conference on Condition Assessment Techniques in Electrical Systems (CATCON)",
  //     year: "2013",
  //     pages: "353-357",
  //     month: "December",
  //     location: "Kolkata, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "43",
  //     title:
  //       "ECG signal analysis for detection of Cardiovascular abnormalities and Ischemic episodes",
  //     authors: "G. K. Sahoo, S. Ari, and S. K. Patra",
  //     conference:
  //       "IEEE Conference on Information & Communication Technologies (ICT)",
  //     year: "2013",
  //     pages: "1055-1059",
  //     month: "April",
  //     location: "Tamil Nadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "44",
  //     title:
  //       "Color hand gesture segmentation for images with complex background",
  //     authors: "B. D. Avinash, D. K. Ghosh, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Circuits, Power and Computing Technologies (ICCPCT)",
  //     year: "2013",
  //     pages: "1127-1131",
  //     month: "March",
  //     location: "Nagercoil, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "45",
  //     title:
  //       "Wavelet transform based error detection in signal acquired from artillery unit",
  //     authors:
  //       "B. B. Pradhan, S. Ari, G. K. Sahoo, D. K. Jena, S. K. Patra and R. Appavuraj",
  //     conference:
  //       "IEEE 1st International Conference on Condition Assessment Techniques in Electrical Systems (CATCON)",
  //     year: "2013",
  //     pages: "243-248",
  //     month: "December",
  //     location: "Kolkata, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "46",
  //     title:
  //       "Suspicious lesion detection in mammograms using undecimated Wavelet Transform and Adaptive Thresholding",
  //     authors: "A. Nayak, D. K. Ghosh and S. Ari",
  //     conference:
  //       "15th International Conference on Advanced Computing Technologies (ICACT)",
  //     year: "2013",
  //     pages: "1-6",
  //     month: "September",
  //     location: "Andhra Pradesh, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "47",
  //     title:
  //       "Denoising of ECG signals using empirical mode decomposition based technique",
  //     authors: "A. Chacko, and S. Ari",
  //     conference:
  //       "IEEE International Conference on Advances in Engineering, Science and Management (ICAESM)",
  //     year: "2012",
  //     pages: "6-9",
  //     month: "March",
  //     location: "Tamil-Nadu, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "48",
  //     title:
  //       "A novel technique for QRS complex detection in ECG signal based on Hilbert transform and autocorrelation",
  //     authors: "J.P. Sahoo, S. Behera, and S. Ari",
  //     conference: "International Conference on Electronic Systems (ICES)",
  //     year: "2011",
  //     pages: "27-31",
  //     month: "January",
  //     location: "Rourkela, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "49",
  //     title:
  //       "A Static Hand Gesture Recognition Algorithm Using K-Mean Based Radial Basis Function Neural Network",
  //     authors: "D. K. Ghosh and S. Ari",
  //     conference:
  //       "IEEE International Conference on Information, Communications and Signal Processing (ICICS)",
  //     year: "2011",
  //     pages: "1-5",
  //     month: "December",
  //     location: "Singapore",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "50",
  //     title:
  //       "On an Algorithm for Detection of QRS Complexes in Noisy Electrocardiogram Signal",
  //     authors: "M. K. Das, S. Ari, and S. Priyadharsini",
  //     conference: "IEEE Annual India Conference (INDICON)",
  //     year: "2011",
  //     pages: "1-5",
  //     month: "December",
  //     location: "Hyderabad, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "51",
  //     title:
  //       "DSP Implementation of Phonocardiogram based Heart Valve Disorder Detection System",
  //     authors: "S. Ari, K. Sensharma, and G. Saha",
  //     conference:
  //       "PCEA-IFToMM International Conference on Recent Trends in Automation & Its Adaptation to Industries (PICA)",
  //     year: "2006",
  //     pages: "73",
  //     month: "July",
  //     location: "Nagpur, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "52",
  //     title:
  //       "On An Algorithm for Boundary Estimation of Commonly Occurring Heart Valve Diseases in Time Domain",
  //     authors: "S. Ari, P. Kumar, and G. Saha",
  //     conference: "IEEE INDICON 2006 third Indian Annual Conference",
  //     year: "2006",
  //     pages: "1-5",
  //     month: "September",
  //     location: "New Delhi, India",
  //     type: "International Conference",
  //   },
  //   {
  //     id: "53",
  //     title:
  //       "Robust Feature Extraction for Classification of Heart Sounds Using EMD based Method",
  //     authors: "S. Ari and G. Saha",
  //     conference:
  //       "IEEE INDICON 2007 & 16th annual symposium of IEEE Bangalore section",
  //     year: "2007",
  //     pages: "1-5",
  //     month: "September",
  //     location: "Bangalore, India",
  //     type: "International Conference",
  //   },
  // ];

  const getDataArray = (): PublicationItem[] => {
    switch (pageType) {
      case "patent":
        return patents;
      case "journal":
        return journals;
      case "conference":
        return conferences;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <Navbar />
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">{icon}</span>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {title}
          </h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto font-medium">
            Pattern Recognition and Machine Intelligence Laboratory
          </p>
        </div>

        {/* Results + Search Row */}
        <div className="flex justify-between items-center mb-8">
          {/*  Results count */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-blue-100">
            <p className="text-blue-800 font-semibold">
              Showing{" "}
              <span className="text-blue-600 font-bold">
                {filteredData.length}
              </span>{" "}
              {filteredData.length === 1 ? "entry" : "entries"}
            </p>
          </div>

          {/* Search + Year Filter */}
          <div className="flex items-center gap-2 relative">
            {/* Search bar */}
            <div className="flex items-center w-80 bg-white border border-gray-300 rounded-full shadow-sm px-3 py-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 px-2"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-300"
              >
                🔍
              </button>
            </div>

            {/* Year Filter Button */}
            <button
              onClick={() => setShowYearMenu(!showYearMenu)}
              className="bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-full shadow-sm transition-all duration-200"
            >
              🗓️ Filter
            </button>

            {/* Dropdown Menu */}
            {showYearMenu && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-44 z-50 max-h-60 overflow-y-auto">
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
                    setYearFilters([]); // resets all
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
                              ? prev.filter((y) => y !== year) // unselect
                              : [...prev, year] // select
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

        {/* Data Grid */}
        {isLoading ? (
  // ✅ Loading indicator
  <div className="flex flex-col items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
    <p className="text-blue-800 font-medium text-lg">Loading data...</p>
  </div>
) : filteredData.length > 0 ? (
  // ✅ Data grid after loading
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredData.map((item) => (
      <Card key={item.id} item={item} type={pageType} />
    ))}
  </div>
) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-12 text-center border border-blue-100">
            <div className="text-blue-300 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
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
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              No Data Found
            </h3>
            <p className="text-blue-700">
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
