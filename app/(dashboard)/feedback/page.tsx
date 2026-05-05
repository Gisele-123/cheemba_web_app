'use client';

import { supabase } from '@/lib/supabase/client';
import { FEEDBACK_STORAGE_KEY, type CompanyFeedback, demoFeedback } from '@/lib/demo/feedback';
import { FormEvent, useEffect, useState } from 'react';
import { MessageSquareText } from 'lucide-react';

export default function FeedbackPage() {
  const [companyName, setCompanyName] = useState('Cheemba Company');
  const [feedbackList, setFeedbackList] = useState<CompanyFeedback[]>(demoFeedback);
  const [feedbackCategory, setFeedbackCategory] = useState<CompanyFeedback['category']>('Performance');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      setCompanyName(String(data.user?.user_metadata?.company_name || data.user?.user_metadata?.display_name || 'Cheemba Company'));
    };
    load();

    const savedFeedback = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (savedFeedback) {
      setFeedbackList(JSON.parse(savedFeedback));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
  }, [feedbackList]);

  const onSubmitFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackComment.trim()) {
      setFeedbackMessage('Please write your feedback before submitting.');
      return;
    }
    const newFeedback: CompanyFeedback = {
      id: `${Date.now()}`,
      companyName,
      category: feedbackCategory,
      rating: feedbackRating,
      comment: feedbackComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
    setFeedbackComment('');
    setFeedbackCategory('Performance');
    setFeedbackRating(5);
    setFeedbackMessage('Feedback submitted. Thank you for improving Cheemba.');
  };

  return (
    <div className="space-y-6 p-6 max-md:p-3">
      <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-6 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">Company Feedback Center</h2>
        <p className="mt-1 text-sm text-blue-100">Share operational feedback to help improve the platform and dispatch workflow.</p>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-[#0A3B83]" />
          <h4 className="text-lg font-semibold text-[#0E2040]">Submit Feedback</h4>
        </div>
        <form className="grid gap-3 md:grid-cols-3" onSubmit={onSubmitFeedback}>
          <select
            value={feedbackCategory}
            onChange={(event) => setFeedbackCategory(event.target.value as CompanyFeedback['category'])}
            className="rounded-lg border p-3"
          >
            <option value="Performance">Performance</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Routing">Routing</option>
            <option value="Support">Support</option>
          </select>
          <select value={feedbackRating} onChange={(event) => setFeedbackRating(Number(event.target.value))} className="rounded-lg border p-3">
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Fair</option>
            <option value={2}>2 - Needs Improvement</option>
            <option value={1}>1 - Poor</option>
          </select>
          <button type="submit" className="rounded-lg bg-[#0A3B83] px-4 py-3 text-white hover:bg-[#082f69]">
            Submit Feedback
          </button>
          <textarea
            value={feedbackComment}
            onChange={(event) => setFeedbackComment(event.target.value)}
            placeholder="Share your operational feedback about the system..."
            className="min-h-28 rounded-lg border p-3 md:col-span-3"
          />
        </form>
        {feedbackMessage && <p className="mt-2 text-sm text-slate-600">{feedbackMessage}</p>}
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h4 className="text-lg font-semibold text-[#0E2040]">Recent Feedback</h4>
        <div className="mt-4 space-y-3">
          {feedbackList.map((entry) => (
            <div key={entry.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#0E2040]">{entry.companyName}</p>
                <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-sm text-slate-700"><span className="font-medium">{entry.category}</span> - {entry.rating}/5</p>
              <p className="mt-1 text-sm text-slate-600">{entry.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
