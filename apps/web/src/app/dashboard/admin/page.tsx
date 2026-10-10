'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { VerificationStatus, ReportStatus } from '@petco/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  ShieldCheck,
  Users,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  UserCheck,
  TrendingUp,
  ShieldAlert,
  FileText,
  Activity,
  Clock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('VERIFICATIONS');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    const [statsRes, usersRes, reqRes, bookRes, repRes, auditRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/requests'),
      api.get('/admin/bookings'),
      api.get('/reports'),
      api.get('/admin/audit-logs'),
    ]);

    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    if (usersRes.success && usersRes.data) setUsers(usersRes.data);
    if (reqRes.success && reqRes.data) setRequests(reqRes.data);
    if (bookRes.success && bookRes.data) setBookings(bookRes.data);
    if (repRes.success && repRes.data) setReports(repRes.data);
    if (auditRes.success && auditRes.data) setAuditLogs(auditRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyHelper = async (helperProfileId: string, status: VerificationStatus) => {
    const res = await api.patch(`/admin/helpers/${helperProfileId}/verify`, { status });
    if (res.success) {
      fetchAdminData();
    } else {
      alert(res.error || 'Failed to update helper status');
    }
  };

  const handleToggleSuspend = async (userId: string, currentSuspended: boolean) => {
    const res = await api.patch(`/admin/users/${userId}/suspend`, { isSuspended: !currentSuspended });
    if (res.success) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, isSuspended: !currentSuspended } : u)));
    } else {
      alert(res.error || 'Failed to toggle suspension');
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: ReportStatus) => {
    const res = await api.patch(`/reports/${reportId}/status`, { status, resolutionNotes: `Marked ${status} by admin` });
    if (res.success) {
      setReports(reports.map((r) => (r.id === reportId ? { ...r, status } : r)));
    } else {
      alert(res.error || 'Failed to update report status');
    }
  };

  const pendingHelpers = users.filter(
    (u) => u.helperProfile && u.helperProfile.verificationStatus === VerificationStatus.PENDING
  );

  const emergencyRequests = requests.filter((r) => r.isEmergency || r.category === 'EMERGENCY');

  const tabs = [
    { id: 'VERIFICATIONS', label: 'Helper Verifications', count: pendingHelpers.length },
    { id: 'EMERGENCY', label: '🚨 Emergency Monitor', count: emergencyRequests.length },
    { id: 'REPORTS', label: 'Safety Reports', count: reports.filter((r) => r.status === 'OPEN').length },
    { id: 'USERS', label: 'All Users', count: users.length },
    { id: 'REQUESTS', label: 'Requests Log', count: requests.length },
    { id: 'BOOKINGS', label: 'Bookings Log', count: bookings.length },
    { id: 'AUDIT', label: 'Live Audit Log', count: auditLogs.length },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-100 text-forest-800 text-xs font-bold rounded-full mb-1 border border-forest-200 shadow-soft-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" /> Platform Operations & Safety Portal
          </div>
          <h1 className="text-2xl font-black text-forest-950 tracking-tight">Ecosystem Administration & Intelligence</h1>
          <p className="text-xs text-stone-500 mt-0.5">Monitor live activity, verify care partners, resolve safety disputes, and track financials.</p>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 space-y-1.5 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Gross Marketplace Volume</p>
            <h3 className="text-2xl font-black text-forest-950">${stats.grossVolume?.toFixed(2)}</h3>
            <span className="text-[11px] text-forest-700 font-bold block">15% Take: ${stats.platformRevenue?.toFixed(2)}</span>
          </Card>

          <Card className="p-5 space-y-1.5 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Registered Users</p>
            <h3 className="text-2xl font-black text-forest-950">{stats.totalUsers}</h3>
            <span className="text-[11px] text-stone-500 block">{stats.totalOwners} Customers • {stats.totalHelpers} Helpers</span>
          </Card>

          <Card className="p-5 space-y-1.5 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Bookings Completed</p>
            <h3 className="text-2xl font-black text-forest-800">{stats.completedBookings}</h3>
            <span className="text-[11px] text-stone-500 block">out of {stats.totalBookings} total bookings</span>
          </Card>

          <Card className="p-5 space-y-1.5 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Verifications Pending</p>
            <h3 className="text-2xl font-black text-amber-600">{stats.pendingVerifications}</h3>
            <span className="text-[11px] text-stone-500 block">{stats.verifiedHelpers} helpers verified</span>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-9 h-9 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : activeTab === 'VERIFICATIONS' ? (
        <div className="space-y-4">
          {pendingHelpers.length === 0 ? (
            <Card className="p-12 text-center space-y-2 bg-ivory-50/50 border-stone-200">
              <CheckCircle2 className="w-10 h-10 text-forest-600 mx-auto" />
              <h3 className="text-base font-bold text-forest-950">All Helper Verifications Cleared</h3>
              <p className="text-xs text-stone-500">No pending helper verification applications at this time.</p>
            </Card>
          ) : (
            pendingHelpers.map((u) => (
              <Card key={u.id} className="p-6 space-y-4 border-stone-200 shadow-soft-sm hover:shadow-soft-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={u.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'}
                      alt={u.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-forest-500/20 shadow-soft-sm"
                    />
                    <div>
                      <h4 className="text-base font-bold text-forest-950">{u.name}</h4>
                      <p className="text-xs text-stone-500">{u.email} • {u.location || 'San Francisco, CA'}</p>
                      <span className="text-xs font-bold text-forest-700 mt-1 inline-block">
                        Rate: ${u.helperProfile?.hourlyRate}/hr • Coverage: {u.helperProfile?.serviceRadius} km radius
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="forest"
                      className="text-xs shadow-soft-sm"
                      onClick={() => handleVerifyHelper(u.helperProfile.id, VerificationStatus.VERIFIED)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                      onClick={() => handleVerifyHelper(u.helperProfile.id, VerificationStatus.REJECTED)}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Application
                    </Button>
                  </div>
                </div>

                {u.helperProfile?.bio && (
                  <p className="text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                    <span className="font-bold text-forest-950">Experience & Bio: </span> {u.helperProfile.bio}
                  </p>
                )}

                {u.helperProfile?.governmentIdUrl && (
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="text-stone-400 font-semibold">Submitted Documents:</span>
                    <a
                      href={u.helperProfile.governmentIdUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-forest-700 hover:underline flex items-center gap-1 font-bold"
                    >
                      <FileText className="w-3.5 h-3.5" /> Government ID Document <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : activeTab === 'EMERGENCY' ? (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs text-rose-950 flex items-center gap-2 shadow-soft-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Live Emergency Ticker & Dispatch Monitor</p>
              <p className="text-rose-800 text-[11px]">
                High-priority requests flagged for immediate vet accompaniment or transit. Track response velocity in real time.
              </p>
            </div>
          </div>

          {emergencyRequests.length === 0 ? (
            <Card className="p-12 text-center space-y-2 bg-ivory-50/50 border-stone-200">
              <CheckCircle2 className="w-10 h-10 text-forest-600 mx-auto" />
              <h3 className="text-base font-bold text-forest-950">No Active Emergency Requests</h3>
              <p className="text-xs text-stone-500">All pet emergencies have been addressed or resolved.</p>
            </Card>
          ) : (
            emergencyRequests.map((req) => (
              <Card key={req.id} className="p-5 border-rose-300 bg-rose-50/15 space-y-3 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                      🚨 URGENT EMERGENCY
                    </span>
                    <h4 className="text-sm font-bold text-forest-950">{req.title}</h4>
                  </div>
                  <span className="text-lg font-black text-rose-700">${req.budget}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-rose-100">
                  <p><span className="font-bold text-stone-700">Owner:</span> {req.owner?.name} ({req.owner?.phone || 'On file'})</p>
                  <p><span className="font-bold text-stone-700">Pet:</span> {req.pet?.name} ({req.pet?.breed || req.pet?.species})</p>
                  <p><span className="font-bold text-stone-700">Location:</span> {req.location}</p>
                </div>

                <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-rose-100">
                  <span className="font-bold text-forest-950">Situation: </span>{req.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <StatusBadge status={req.status} />
                  <span className="text-[11px] text-stone-400">Created {new Date(req.createdAt).toLocaleTimeString()}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : activeTab === 'REPORTS' ? (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card className="p-12 text-center space-y-2 bg-ivory-50/50 border-stone-200">
              <CheckCircle2 className="w-10 h-10 text-forest-600 mx-auto" />
              <h3 className="text-base font-bold text-forest-950">Safety & Trust Queue Clear</h3>
              <p className="text-xs text-stone-500">No user complaints or platform safety reports pending.</p>
            </Card>
          ) : (
            reports.map((rep) => (
              <Card key={rep.id} className="p-5 space-y-3 border-stone-200 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full uppercase">
                      {rep.reason}
                    </span>
                    <h4 className="text-sm font-bold text-forest-950 mt-1">
                      Report against {rep.reportedUser?.name} by {rep.reporter?.name}
                    </h4>
                  </div>
                  <span className={clsx('px-2.5 py-1 text-xs font-bold rounded-full', rep.status === 'OPEN' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700')}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                  <span className="font-bold text-forest-950">Details: </span>{rep.description}
                </p>

                {rep.status === 'OPEN' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-stone-600 border-stone-200"
                      onClick={() => handleUpdateReportStatus(rep.id, ReportStatus.DISMISSED)}
                    >
                      Dismiss Report
                    </Button>
                    <Button
                      size="sm"
                      variant="forest"
                      className="text-xs shadow-soft-sm"
                      onClick={() => handleUpdateReportStatus(rep.id, ReportStatus.RESOLVED)}
                    >
                      Mark as Resolved
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : activeTab === 'AUDIT' ? (
        <div className="space-y-3">
          {auditLogs.length === 0 ? (
            <Card className="p-12 text-center space-y-2 bg-ivory-50/50 border-stone-200">
              <Activity className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-forest-950">No Audit Events Logged</h3>
              <p className="text-xs text-stone-500">Administrative actions will appear here in chronological order.</p>
            </Card>
          ) : (
            auditLogs.map((log) => (
              <Card key={log.id} className="p-4 flex items-center justify-between text-xs border-stone-200 shadow-soft-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                      {log.action}
                    </span>
                    <span className="font-bold text-forest-950">Admin: {log.admin?.name || log.admin?.email}</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">Target: {log.targetType} #{log.targetId}</p>
                </div>
                <span className="text-[11px] text-stone-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </Card>
            ))
          )}
        </div>
      ) : activeTab === 'USERS' ? (
        <Card className="overflow-x-auto p-0 rounded-2xl border-stone-200 shadow-soft-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-400 uppercase font-semibold border-b border-stone-200">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4 font-bold text-forest-950">
                    {u.name}
                    <span className="block text-[11px] text-stone-400 font-normal">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-stone-500">{u.location || '—'}</td>
                  <td className="p-4">
                    {u.isSuspended ? (
                      <span className="text-rose-600 font-bold">Suspended</span>
                    ) : (
                      <span className="text-forest-700 font-bold">Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant={u.isSuspended ? 'forest' : 'outline'}
                      className="text-xs shadow-soft-sm"
                      onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                    >
                      {u.isSuspended ? 'Reactivate' : 'Suspend'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : activeTab === 'REQUESTS' ? (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="p-4 flex items-center justify-between text-xs border-stone-200 shadow-soft-sm">
              <div>
                <h4 className="font-bold text-forest-950 text-sm">{r.title}</h4>
                <p className="text-stone-500">
                  Customer: {r.owner?.name} • Pet: {r.pet?.name} ({r.serviceType})
                </p>
                <span className="text-[11px] text-stone-400">
                  {new Date(r.scheduledDate).toLocaleDateString()} @ {r.startTime} • {r.location}
                </span>
              </div>
              <div className="text-right space-y-1">
                <StatusBadge status={r.status} />
                <span className="block font-black text-forest-950">${r.budget.toFixed(2)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between text-xs border-stone-200 shadow-soft-sm">
              <div>
                <h4 className="font-bold text-forest-950 text-sm">
                  {b.request?.serviceType} for {b.request?.pet?.name}
                </h4>
                <p className="text-stone-500">
                  Customer: {b.owner?.name} ➔ Helper: {b.helper?.name}
                </p>
                <span className="text-[11px] text-stone-400">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-right space-y-1">
                <StatusBadge status={b.status} />
                <span className="block font-black text-forest-800">${b.agreedPrice.toFixed(2)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
