import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/lib/api-client';
import type { Play } from '@shared/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Gamepad2, Clock, Star, Users } from 'lucide-react';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export function AnalyticsDashboard() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [subscribers, setSubscribers] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const secret = sessionStorage.getItem('admin-secret') || '';
        const [playsData, subscribersData] = await Promise.all([
          api<Play[]>('/api/admin/analytics', { headers: { 'X-Admin-Secret': secret } }),
          api<{ id: string }[]>('/api/admin/subscribers', { headers: { 'X-Admin-Secret': secret } })
        ]);
        setPlays(playsData);
        setSubscribers(subscribersData);
      } catch (error) {
        toast.error('Failed to fetch analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const analyticsSummary = useMemo(() => {
    if (plays.length === 0) {
      return { totalPlays: 0, avgScore: 0, avgTime: 0, playsPerType: [] };
    }
    const totalPlays = plays.length;
    const avgScore = plays.reduce((sum, p) => sum + p.score, 0) / totalPlays;
    const avgTime = plays.reduce((sum, p) => sum + p.time, 0) / totalPlays;
    const playsPerType = plays.reduce((acc, play) => {
      const gameType = play.gameId.split('-')[0] || 'Unknown';
      acc[gameType] = (acc[gameType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const chartData = Object.entries(playsPerType).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    return {
      totalPlays,
      avgScore: parseFloat(avgScore.toFixed(1)),
      avgTime: parseFloat(avgTime.toFixed(1)),
      playsPerType: chartData,
    };
  }, [plays]);
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.totalPlays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.avgScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time (s)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsSummary.avgTime}s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plays per Game Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsSummary.playsPerType}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="rgb(59, 130, 246)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Game Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsSummary.playsPerType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsSummary.playsPerType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}