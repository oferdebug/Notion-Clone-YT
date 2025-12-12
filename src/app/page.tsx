"use client";
/** @format */

import { useState } from 'react';

import { collection } from 'firebase/firestore';
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';

import NewDocumentButton from '@/components/NewDocumentButton';
import { useUser } from '@clerk/nextjs';

import { db } from '../../firebase';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [now] = useState(() => Date.now());

  const [roomsData, roomsLoading] = useCollection(
    user && collection(db, "users", user.id, "rooms")
  );

  const myDocs = roomsData?.docs.filter(doc => doc.data().role === "owner") || [];
  const sharedDocs = roomsData?.docs.filter(doc => doc.data().role !== "owner") || [];
  const totalDocs = myDocs.length + sharedDocs.length;

  const recentDocs = roomsData?.docs
    ?.sort((a, b) => {
      const aTime = a.data().createdAt?.seconds || 0;
      const bTime = b.data().createdAt?.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 3) || [];

  const timeAgo = (timestamp: { seconds: number } | null | undefined): string => {
    if (!timestamp) return "Just now";
    const seconds = Math.floor((now - timestamp.seconds * 1000) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const daysActive = roomsData?.docs.length 
    ? Math.floor((now - (roomsData.docs[0].data().createdAt?.seconds || 0) * 1000) / (1000 * 60 * 60 * 24)) 
    : 0;

	return (
	  //NOTE - This is the main container for the home page
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDelay: "1s" }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your collaborative workspace awaits
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="text-primary" size={24} />
                </div>
                <TrendingUp className="text-success" size={20} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{totalDocs}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>

            <div className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Users className="text-accent" size={24} />
                </div>
                <TrendingUp className="text-success" size={20} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{sharedDocs.length}</div>
              <div className="text-sm text-muted-foreground">Shared With Me</div>
            </div>

            <div className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
                  <Calendar className="text-success" size={24} />
                </div>
                <TrendingUp className="text-success" size={20} />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{daysActive}</div>
              <div className="text-sm text-muted-foreground">Days Active</div>
            </div>
          </div>

          {/* Recent & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Documents */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  <h2 className="text-xl font-semibold text-foreground">Recent Documents</h2>
                </div>
              </div>

              {roomsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (recentDocs && recentDocs.length > 0) ? (
                <div className="space-y-2">
                  {recentDocs.map((doc) => {
                    const data = doc.data();
                    return (
                      <button
                        key={doc.id}
                        onClick={() => router.push(`/doc/${data.roomId}`)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <FileText className="text-primary" size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            Document {data.roomId.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.role === "owner" ? "Created" : "Shared"} • {timeAgo(data.createdAt)}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto mb-3 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">No documents yet</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-accent" size={20} />
                <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
              </div>

              <div className="space-y-3">
                <NewDocumentButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}