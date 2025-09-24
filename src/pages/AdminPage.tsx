import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from '@/components/ui/sonner';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { GameManagementTable } from '@/components/admin/GameManagementTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { ShieldCheck, LayoutDashboard, Gamepad, Mail, Download } from 'lucide-react';
export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  useEffect(() => {
    const storedKey = sessionStorage.getItem('admin-secret');
    if (storedKey) {
      setIsAuthenticated(true);
    }
  }, []);
  const handleLogin = () => {
    if (secretKey) {
      sessionStorage.setItem('admin-secret', secretKey);
      setIsAuthenticated(true);
      toast.success('Authentication successful!');
    } else {
      toast.error('Please enter a secret key.');
    }
  };
  const handleExportSubscribers = async () => {
    try {
      const subscribers = await api<User[]>('/api/admin/subscribers', {
        headers: { 'X-Admin-Secret': sessionStorage.getItem('admin-secret') || '' }
      });
      let csvContent = "data:text/csv;charset=utf-8,Email,Name,SubscribedAt\n";
      subscribers.forEach((user) => {
        const date = new Date(user.createdAt).toISOString();
        csvContent += `${user.id},${user.name || ''},${date}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "lexileap_subscribers.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Subscribers exported successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Export failed: ${errorMessage}`);
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-muted/40">
        <div className="w-full max-w-sm p-8 space-y-6 bg-background rounded-2xl shadow-lg">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-brand-blue" />
            <h1 className="mt-4 text-3xl font-display font-bold">Admin Access</h1>
            <p className="mt-2 text-muted-foreground">Please enter the secret key to continue.</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12 text-center" />

            <Button onClick={handleLogin} className="w-full h-12 text-lg">
              Authenticate
            </Button>
          </div>
        </div>
        <Toaster richColors />
      </div>);

  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-6xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-5xl font-bold tracking-tighter">Admin Panel</h1>
          <p className="text-lg text-muted-foreground mt-2">Manage games, view analytics, and export data.</p>
        </div>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="games"><Gamepad className="mr-2 h-4 w-4" />Games</TabsTrigger>
            <TabsTrigger value="subscribers"><Mail className="mr-2 h-4 w-4" />Subscribers</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            <GameManagementTable />
          </TabsContent>
          <TabsContent value="subscribers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Export the list of all newsletter subscribers as a CSV file.
                </p>
                <Button onClick={handleExportSubscribers}>
                  <Download className="mr-2 h-4 w-4" /> Export as CSV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <Toaster richColors />
    </div>);

}