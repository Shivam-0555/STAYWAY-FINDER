"use client";

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface ReplyItem {
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
  attachmentPath?: string;
}

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'read' | 'replied';
  attachmentPath?: string;
  replies?: ReplyItem[];
  createdAt: string;
}

type FilterStatus = 'all' | 'new' | 'read' | 'replied';
type SortOrder = 'newest' | 'oldest';

const statusStyles: Record<string, string> = {
  new: 'bg-yellow-500/20 text-yellow-400',
  read: 'bg-blue-500/20 text-blue-400',
  replied: 'bg-green-500/20 text-green-400',
};

const statusLabels: Record<string, string> = {
  new: 'Unread',
  read: 'Read',
  replied: 'Replied',
};

const priorityStyles: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-emerald-500/20 text-emerald-400',
};

const pageSize = 5;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function MessagesSection() {
  const { data, error, isLoading, mutate } = useSWR('/api/v1/messages', fetcher);
  const messages = useMemo(() => (Array.isArray(data) ? (data as MessageItem[]) : []), [data]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MessageItem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [copyState, setCopyState] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<string | null>(null);
  const [replyAttachmentName, setReplyAttachmentName] = useState('');

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    let filtered = [...messages];

    if (normalizedSearch) {
      filtered = filtered.filter((message) => {
        const haystack = `${message.name} ${message.email} ${message.subject ?? ''}`.toLowerCase();
        return haystack.includes(normalizedSearch);
      });
    }

    if (filter !== 'all') {
      filtered = filtered.filter((message) => message.status === filter);
    }

    filtered.sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();

      return sortOrder === 'newest' ? rightTime - leftTime : leftTime - rightTime;
    });

    return filtered;
  }, [filter, messages, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const visibleMessages = filteredMessages.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = messages.filter((message) => message.status === 'new').length;

  const updateMessage = async (id: string, status: MessageItem['status']) => {
    const response = await fetch('/api/v1/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });

    if (response.ok) {
      setFeedback(status === 'replied' ? 'Message marked as replied.' : 'Message marked as read.');
      mutate();
      if (selectedMessage?._id === id) {
        setSelectedMessage((current) => current ? { ...current, status } : current);
      }
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      return;
    }

    const response = await fetch('/api/v1/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedMessage._id,
        status: 'replied',
        replyMessage: replyText.trim(),
        replyAttachment,
      }),
    });

    if (response.ok) {
      setFeedback('Reply sent and stored successfully.');
      setReplyText('');
      setReplyAttachment(null);
      setReplyAttachmentName('');
      mutate();
      setSelectedMessage((current) => current ? { ...current, status: 'replied' } : current);
    }
  };

  const deleteMessage = async () => {
    if (!deleteTarget) {
      return;
    }

    const response = await fetch(`/api/v1/messages?id=${deleteTarget._id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setFeedback('Message deleted successfully.');
      setDeleteTarget(null);
      setSelectedMessage(null);
      mutate();
    }
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      setReplyAttachment(result);
      setReplyAttachmentName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(key);
      window.setTimeout(() => setCopyState(null), 1200);
    } catch {
      setFeedback('Unable to copy automatically.');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (value: FilterStatus) => {
    setFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOrder) => {
    setSortOrder(value);
    setPage(1);
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-white">Messages</h2>
          <p className="text-gray-400">Review visitor support and contact messages.</p>
        </div>
        <div className="rounded-full bg-sky-600 px-3 py-1 text-sm font-medium text-white">
          {unreadCount} unread
        </div>
      </div>

      {feedback && (
        <div className="mb-4 rounded border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-200">
          {feedback}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search by name, email or subject"
          className="w-full rounded border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none focus:border-sky-400 lg:max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(event) => handleFilterChange(event.target.value as FilterStatus)}
            className="rounded border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none"
          >
            <option value="all">All</option>
            <option value="new">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) => handleSortChange(event.target.value as SortOrder)}
            className="rounded border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-lg border border-gray-700 bg-gray-900/70 p-4">
              <div className="h-4 w-32 rounded bg-gray-700" />
              <div className="mt-3 h-3 w-40 rounded bg-gray-800" />
              <div className="mt-2 h-3 w-3/4 rounded bg-gray-800" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-800" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400">Failed to load messages.</p>}

      {!isLoading && !error && messages.length === 0 && (
        <p className="text-gray-400">No messages found.</p>
      )}

      {!isLoading && !error && messages.length > 0 && visibleMessages.length === 0 && (
        <p className="text-gray-400">No messages match your current search or filter.</p>
      )}

      {!isLoading && !error && visibleMessages.length > 0 && (
        <div className="space-y-4">
          {visibleMessages.map((message) => (
            <div key={message._id} className="rounded-lg border border-gray-700 bg-gray-900/70 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${statusStyles[message.status]}`}>
                      {statusLabels[message.status]}
                    </span>
                    <span className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">
                      {message.category}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs ${priorityStyles[message.priority]}`}>
                      {message.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{message.email}</p>
                  {message.subject && <p className="text-sm text-gray-300">{message.subject}</p>}
                  <p className="mt-2 line-clamp-3 text-sm text-gray-200">{message.message}</p>
                  <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
                    onClick={() => setSelectedMessage(message)}
                  >
                    View Details
                  </button>
                  <button
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                    onClick={() => updateMessage(message._id, 'read')}
                  >
                    Mark Read
                  </button>
                  <button
                    className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                    onClick={() => updateMessage(message._id, 'replied')}
                  >
                    Mark Replied
                  </button>
                  <button
                    className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    onClick={() => setDeleteTarget(message)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredMessages.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-300">
          <p>
            Showing {Math.min(pageSize, visibleMessages.length)} of {filteredMessages.length} messages
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded border border-gray-600 px-3 py-1.5 hover:bg-gray-700"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="rounded bg-gray-700 px-3 py-1.5">
              {page} / {totalPages}
            </span>
            <button
              className="rounded border border-gray-600 px-3 py-1.5 hover:bg-gray-700"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-gray-700 bg-gray-900 p-5 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Message Details</h3>
                <p className="mt-1 text-sm text-gray-400">Review the full message and take quick actions.</p>
              </div>
              <button className="rounded bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700" onClick={() => setSelectedMessage(null)}>
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-gray-400">Full Name</p>
                  <p className="mt-1 font-medium text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="mt-1 font-medium text-white">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone Number</p>
                  <p className="mt-1 font-medium text-white">{selectedMessage.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Status</p>
                  <p className="mt-1 font-medium text-white">{statusLabels[selectedMessage.status]}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400">Subject</p>
                <p className="mt-1 font-medium text-white">{selectedMessage.subject || 'No subject provided'}</p>
              </div>

              <div>
                <p className="text-gray-400">Complete Message</p>
                <p className="mt-1 whitespace-pre-wrap text-white">{selectedMessage.message}</p>
              </div>

              {selectedMessage.attachmentPath && (
                <div>
                  <p className="text-gray-400">Screenshot Attachment</p>
                  <a href={selectedMessage.attachmentPath} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sky-400 underline">
                    View attachment
                  </a>
                </div>
              )}

              <div>
                <p className="text-gray-400">Date & Time</p>
                <p className="mt-1 font-medium text-white">{formatDate(selectedMessage.createdAt)}</p>
              </div>

              {(selectedMessage.replies ?? []).length > 0 && (
                <div>
                  <p className="text-gray-400">Conversation History</p>
                  <div className="mt-2 space-y-2">
                    {(selectedMessage.replies ?? []).map((reply, index) => (
                      <div key={`${reply.sender}-${index}`} className="rounded border border-gray-700 bg-gray-800/80 p-3 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-white">{reply.sender === 'admin' ? 'Admin' : 'User'}</span>
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-gray-200">{reply.message}</p>
                        {reply.attachmentPath && (
                          <a href={reply.attachmentPath} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sky-400 underline">
                            View attachment
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 rounded border border-gray-700 bg-gray-800/70 p-3">
              <p className="text-sm font-medium text-white">Reply to User</p>
              <textarea
                value={replyText}
                onChange={(event) => setReplyText(event.target.value)}
                placeholder="Write a reply to this user..."
                rows={4}
                className="mt-2 w-full rounded border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 outline-none focus:border-sky-400"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600">
                  Attach Screenshot
                  <input type="file" accept="image/*" className="hidden" onChange={handleAttachment} />
                </label>
                {replyAttachmentName && <span className="text-sm text-gray-400">{replyAttachmentName}</span>}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                onClick={() => updateMessage(selectedMessage._id, 'read')}
              >
                Mark Read
              </button>
              <button
                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                onClick={() => updateMessage(selectedMessage._id, 'replied')}
              >
                Mark Replied
              </button>
              <button
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                onClick={() => setDeleteTarget(selectedMessage)}
              >
                Delete Message
              </button>
              <button
                className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
                onClick={() => copyValue(selectedMessage.email, 'email')}
              >
                {copyState === 'email' ? 'Email Copied' : 'Copy Email'}
              </button>
              <button
                className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
                onClick={() => copyValue(selectedMessage.message, 'message')}
              >
                {copyState === 'message' ? 'Message Copied' : 'Copy Message'}
              </button>
              <button
                className="rounded bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700"
                onClick={sendReply}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-5 text-white shadow-2xl">
            <h3 className="text-xl font-semibold">Delete Message?</h3>
            <p className="mt-3 text-sm text-gray-400">
              This action cannot be undone. The message will be removed from the admin inbox.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="rounded bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700" onClick={deleteMessage}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
