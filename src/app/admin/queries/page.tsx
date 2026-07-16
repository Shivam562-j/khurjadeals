"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Query, QueryStatus } from "@/types/query";
import Loader from "@/components/common/Loader";

export default function QueriesManager() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/queries");
      if (res.ok) {
        const data = await res.json();
        setQueries(data || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleStatusChange = async (id: string, status: QueryStatus) => {
    try {
      const res = await fetch(`/api/queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQueries(
          queries.map((q) => (q._id === id ? { ...q, status } : q))
        );
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const res = await fetch(`/api/queries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQueries(queries.filter((q) => q._id !== id));
      }
    } catch {}
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Contacted", value: "contacted" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Queries & Enquiries</h1>
        <p className="text-sm text-neutral-450">
          Review and update status of user inquiries from contact forms and properties.
        </p>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : queries.length === 0 ? (
        <div className="text-center p-12 bg-neutral-900 border border-neutral-850 rounded-2xl">
          <p className="text-neutral-400">No queries found.</p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950/20 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                  <th className="py-4 px-6">User Details</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Message</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/50">
                {queries.map((q) => (
                  <tr key={q._id} className="hover:bg-neutral-950/10">
                    <td className="py-4 px-6 font-semibold text-white">
                      <div>{q.name}</div>
                      <a href={`tel:${q.phone}`} className="text-xs text-[var(--primary)] hover:underline block mt-0.5">
                        📞 {q.phone}
                      </a>
                      {q.email && <span className="text-xs text-neutral-550 block">{q.email}</span>}
                    </td>
                    <td className="py-4 px-6 capitalize">
                      <span className="text-xs font-semibold">{q.type}</span>
                      {q.referenceId && (
                        <span className="block text-[10px] text-neutral-500">
                          Ref ID: {q.referenceId}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-400 max-w-xs whitespace-pre-line leading-relaxed">
                      {q.message}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q._id, e.target.value as any)}
                        className={`text-xs font-bold rounded-lg border px-2.5 py-1.5 outline-none bg-neutral-950 ${
                          q.status === "pending"
                            ? "border-rose-900/30 text-rose-500"
                            : q.status === "contacted"
                            ? "border-amber-900/30 text-amber-500"
                            : q.status === "resolved"
                            ? "border-emerald-900/30 text-emerald-500"
                            : "border-neutral-800 text-neutral-400"
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-neutral-950">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                      {q.type === "property" && (
                        <Link
                          href={`/admin/properties?add=true&title=${encodeURIComponent("Listing from " + q.name)}&description=${encodeURIComponent(q.message)}&contactName=${encodeURIComponent(q.name)}&contactPhone=${encodeURIComponent(q.phone)}`}
                          className="text-xs font-semibold text-[var(--primary)] hover:text-white px-2.5 py-1.5 rounded bg-orange-950/10 hover:bg-[var(--primary)] border border-orange-900/10 transition cursor-pointer inline-block"
                        >
                          Convert to Property
                        </Link>
                      )}
                      {q.type === "product" && (
                        <Link
                          href={`/admin/products?add=true&title=${encodeURIComponent("Listing from " + q.name)}&description=${encodeURIComponent(q.message)}&contactName=${encodeURIComponent(q.name)}&contactPhone=${encodeURIComponent(q.phone)}`}
                          className="text-xs font-semibold text-sky-500 hover:text-white px-2.5 py-1.5 rounded bg-sky-950/10 hover:bg-sky-600 border border-sky-900/10 transition cursor-pointer inline-block"
                        >
                          Convert to Product
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-400 px-2.5 py-1.5 rounded bg-red-950/10 hover:bg-red-950/30 border border-red-900/10 transition cursor-pointer inline-block"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
