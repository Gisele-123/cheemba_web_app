'use client';

import React, { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 10) {
      setMessage('New password must be at least 10 characters.');
      return;
    }
    if (currentPassword === newPassword) {
      setMessage('New password must be different from current password.');
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      setLoading(false);
      setMessage('Session expired. Please sign in again.');
      return;
    }

    const verify = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (verify.error) {
      setLoading(false);
      setMessage('Current password is incorrect.');
      return;
    }

    const update = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (update.error) {
      setMessage(update.error.message);
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Password updated successfully.');
  };

  return (
    <div className="space-y-6 p-6 max-md:p-3">
      <h2 className="text-3xl font-medium text-[#0E2040]">Settings</h2>
      <div className="rounded-xl bg-white p-6 shadow-sm max-w-2xl">
        <h3 className="text-xl font-semibold text-[#0E2040]">Change Password</h3>
        <p className="mt-1 text-sm text-slate-600">
          Update the temporary password created by admin to your own secure password.
        </p>
        <form className="mt-5 space-y-4" onSubmit={onChangePassword}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#0A3B83] px-5 py-3 text-white hover:bg-[#082f69] disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Change password'}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;