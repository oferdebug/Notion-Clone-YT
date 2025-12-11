# 📚 Technical Documentation - Notion Clone

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies](#technologies)
4. [Project Structure](#project-structure)
5. [Implemented Features](#implemented-features)
6. [Design System](#design-system)
7. [Authentication & Authorization](#authentication--authorization)
8. [Database](#database)
9. [Real-time Editing](#real-time-editing)
10. [Known Bugs](#known-bugs)
11. [Missing Features](#missing-features)
12. [Installation Instructions](#installation-instructions)
13. [Deployment Instructions](#deployment-instructions)

---

## 🎯 Overview

**Notion Clone** is a web application for document management and real-time collaborative editing, mimicking the basic functionality of Notion.

### Key Features:
- ✅ Real-time collaborative editing
- ✅ Rich text editor
- ✅ Secure user authentication
- ✅ Dark/Light mode
- ✅ Modern and professional design
- ✅ Personal and shared document management

### Core Technologies:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Real-time**: Liveblocks + Yjs
- **Editor**: Tiptap (ProseMirror)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Next.js 15 (App Router)                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │  Pages   │  │Components│  │  Hooks   │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Clerk   │  │ Firebase │  │Liveblocks│             │
│  │  (Auth)  │  │(Database)│  │(RealTime)│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

**1. User Authentication:**
```
User → Clerk Sign-In → Session Created → Middleware Check → Access Granted
```

**2. Document Creation:**
```
User Click → Server Action → Firebase Write → UI Update → Toast Notification
```

**3. Real-time Editing:**
```
User Types → Tiptap → Yjs → Liveblocks → Other Users' Editors
```

---

## 💻 Technologies

### Frontend Stack

#### **Next.js 15.1.3**
- **App Router**: Modern folder-based routing
- **Server Components**: Server-side rendering for optimal performance
- **Server Actions**: Server-side operations without API routes
- **React Compiler**: Automatic optimization

#### **React 19**
- Latest stable version
- Concurrent Features
- Automatic Batching
- Transitions

#### **TypeScript 5.9.3**
- Full Type Safety
- Enhanced Auto-completion
- Development-time Error Detection

#### **Tailwind CSS 4**
- Utility-first CSS
- JIT Compiler
- Custom Design System
- Dark Mode Support

#### **Shadcn/ui**
- Pre-built UI components
- Based on Radix UI
- Accessible
- Customizable

### Authentication

#### **Clerk**
```typescript
// Features:
- Email/Password Authentication
- OAuth (Google)
- User Management
- Session Management
- Protected Routes
- Custom Sign-In/Sign-Up Pages
```

**Advantages:**
- ✅ Quick integration
- ✅ Built-in security
- ✅ Advanced user management
- ✅ OAuth support

### Database

#### **Firebase Firestore**
```typescript
// Data Structure:
users/{userId}/rooms/{roomId}
  - userId: string
  - role: "owner" | "editor"
  - roomId: string
  - createdAt: timestamp

documents/{docId}
  - title: string
  - createdAt: timestamp
  - userId: string

rooms/{roomId}/users/{userEmail}
  - userId: string
  - email: string
  - role: "owner" | "editor"
  - createdAt: timestamp
```

**Use Cases:**
- Document storage
- Permission management
- Metadata storage
- User lists per document

### Real-time Collaboration

#### **Liveblocks**
- WebSocket connection
- Presence (user presence)
- Shared State
- Cursor Tracking

#### **Yjs (CRDT)**
- Automatic Conflict Resolution
- Offline Support
- Efficient Sync
- History Management

#### **Tiptap Editor**
```typescript
// Installed Extensions:
- Document, Paragraph, Text (base)
- Bold, Italic, Strike, Code (formatting)
- Heading (H1, H2, H3)
- BulletList, OrderedList, ListItem
- Blockquote, CodeBlock
- Collaboration, CollaborationCursor
- Placeholder
```

### UI Libraries

#### **Radix UI**
- Accessible components
- Unstyled
- Keyboard Navigation
- ARIA Compliant

#### **Lucide React**
- 1000+ icons
- Tree-shakeable
- Customizable
- TypeScript Support

#### **Sonner**
- Toast Notifications
- Theme-aware
- Stacking Support
- Rich Content

#### **next-themes**
- Dark/Light Mode
- System Preference Detection
- No Flash of Wrong Theme
- TypeScript Support

---

## 📁 Project Structure

```
Notion-Clone/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── page.tsx          # Custom sign-in page
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       └── page.tsx          # Custom sign-up page
│   │   ├── doc/[id]/
│   │   │   ├── layout.tsx            # RoomProvider wrapper
│   │   │   └── page.tsx              # Document page
│   │   ├── auth-endpoint/
│   │   │   └── route.ts              # Liveblocks authorization
│   │   ├── page.tsx                  # Home page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Design System CSS
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── drawer.tsx
│   │   │
│   │   ├── Breadcrumbs.tsx           # Breadcrumb navigation
│   │   ├── Document.tsx              # Main document component
│   │   ├── Editor.tsx                # Tiptap editor
│   │   ├── EditorToolbar.tsx         # Editor toolbar
│   │   ├── Header.tsx                # Top header
│   │   ├── LoadingSpinner.tsx        # Loading spinner
│   │   ├── NewDocumentButton.tsx     # New document button
│   │   ├── RoomProvider.tsx          # Liveblocks provider
│   │   ├── SideBar.tsx               # Sidebar
│   │   ├── SidebarOption.tsx         # Sidebar item
│   │   ├── ThemeProvider.tsx         # Theme provider
│   │   ├── ThemeToggle.tsx           # Theme toggle
│   │   └── Toaster.tsx               # Notification system
│   │
│   └── lib/
│       ├── utils.ts                  # Utility functions
│       ├── useOwner.ts               # Ownership check hook
│       └── liveblocks.ts             # Liveblocks config
│
├── actions/
│   └── actions.ts                    # Server Actions
│
├── firebase.ts                       # Firebase client config
├── firebase-admin.ts                 # Firebase Admin SDK
├── middleware.ts                     # Auth middleware
├── tailwind.config.ts                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## ✅ Implemented Features

### 1. Authentication & Security

#### **Sign-In Page**
- ✅ Custom Email/Password form
- ✅ Google OAuth button
- ✅ Modern design with gradients
- ✅ Animations and transitions
- ✅ Error handling with Toast
- ✅ Loading states

**Technology:**
```typescript
import { useSignIn } from "@clerk/nextjs";

// Create session
const result = await signIn.create({
  identifier: email,
  password: password,
});

if (result.status === "complete") {
  await setActive({ session: result.createdSessionId });
  router.push("/");
}
```

#### **Sign-Up Page**
- ✅ Form with first and last name
- ✅ Email verification process (6 digits)
- ✅ Google OAuth
- ✅ Two-step process: signup → verify
- ✅ Toast notifications
- ✅ Design consistent with Sign-In

**Email Verification Process:**
```typescript
// Step 1: Create account
await signUp.create({
  emailAddress: email,
  password: password,
  firstName: firstName,
  lastName: lastName,
});

// Step 2: Send verification code
await signUp.prepareEmailAddressVerification({ 
  strategy: "email_code" 
});

// Step 3: Verify code
const result = await signUp.attemptEmailAddressVerification({
  code: code,
});
```

#### **Middleware Protection**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

### 2. Document Management

#### **Create New Document**
```typescript
// actions/actions.ts
export async function createNewDocument() {
  const { userId } = await auth();
  const user = await currentUser();
  
  // Create in documents collection
  const docRef = await adminDb.collection("documents").add({
    title: "New Document",
    createdAt: new Date(),
    userId: userId,
  });
  
  // Add to user's rooms list
  await adminDb
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: userId,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });
  
  // Add to rooms collection (for Liveblocks auth)
  await adminDb
    .collection("rooms")
    .doc(docRef.id)
    .collection("users")
    .doc(userEmail)
    .set({
      userId: userId,
      email: userEmail,
      role: "owner",
      createdAt: new Date(),
    });
  
  return { docId: docRef.id };
}
```

**Features:**
- ✅ Styled "New Document" button with gradient
- ✅ Icons: Plus, Sparkles
- ✅ Hover animations (rotation, scale, shadow)
- ✅ Success toast notification
- ✅ Auto-redirect to new document
- ✅ Loading state

#### **Update Document Title**
```typescript
// Document.tsx
const updateTitle = async (e: FormEvent) => {
  e.preventDefault();
  
  if (currentTitle.trim()) {
    await updateDoc(doc(db, "documents", id), {
      title: currentTitle,
    });
    
    toast.success('Title updated!', {
      description: 'Your document title has been saved.',
    });
  }
};
```

**Features:**
- ✅ Input field with FileText icon
- ✅ Card design with hover effect
- ✅ Styled "Update" button with gradient
- ✅ Toast notification
- ✅ Loading state

#### **Document List (Sidebar)**
```typescript
// SideBar.tsx
const [data] = useCollection(
  userId ? query(collection(db, "users", userId, "rooms")) : null
);

const groupedData = useMemo(() => {
  return data.docs.reduce((acc, curr) => {
    const roomData = curr.data();
    if (roomData.role === "Owner") {
      acc.owner.push(typedRoom);
    } else {
      acc.editor.push(typedRoom);
    }
    return acc;
  }, { owner: [], editor: [] });
}, [data]);
```

**Features:**
- ✅ Split into "My Documents" and "Shared With Me"
- ✅ FileText icon for each document
- ✅ Active state with primary color
- ✅ Hover effects
- ✅ Empty state message
- ✅ Mobile menu (Sheet)

### 3. Rich Text Editor (Tiptap)

#### **Tiptap Configuration**
```typescript
// Editor.tsx
const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Bold.configure(),
    Italic.configure(),
    Strike.configure(),
    Code.configure(),
    Heading.configure({ levels: [1, 2, 3] }),
    BulletList.configure(),
    OrderedList.configure(),
    ListItem,
    Blockquote.configure(),
    CodeBlock.configure(),
    HardBreak,
    Collaboration.configure({
      document: provider.yDoc,
    }),
    CollaborationCursor.configure({
      provider: provider.provider,
      user: {
        name: userInfo?.name || "Anonymous",
        color: "#6366f1",
      },
    }),
    Placeholder.configure({
      placeholder: "Type '/' for commands...",
    }),
  ],
});
```

#### **Toolbar Buttons**
```typescript
// EditorToolbar.tsx
const buttons = [
  { name: 'Bold', command: 'toggleBold', icon: Bold },
  { name: 'Italic', command: 'toggleItalic', icon: Italic },
  { name: 'Strike', command: 'toggleStrike', icon: Strikethrough },
  { name: 'Code', command: 'toggleCode', icon: Code },
  { name: 'H1', command: 'toggleHeading', icon: Heading1, level: 1 },
  { name: 'H2', command: 'toggleHeading', icon: Heading2, level: 2 },
  { name: 'H3', command: 'toggleHeading', icon: Heading3, level: 3 },
  { name: 'Bullet', command: 'toggleBulletList', icon: List },
  { name: 'Ordered', command: 'toggleOrderedList', icon: ListOrdered },
  { name: 'Quote', command: 'toggleBlockquote', icon: Quote },
];
```

**Features:**
- ✅ Sticky toolbar with backdrop-blur
- ✅ Active state for active buttons
- ✅ Hover effects
- ✅ Icons with strokeWidth: 2.5
- ✅ Dividers between groups
- ✅ Smooth transitions

#### **ProseMirror Styling**
```css
/* globals.css */
.ProseMirror {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.65;
  color: var(--foreground);
  
  /* Headings */
  h1 { font-size: 2.25rem; font-weight: 700; }
  h2 { font-size: 1.875rem; font-weight: 600; }
  h3 { font-size: 1.5rem; font-weight: 600; }
  
  /* Code blocks */
  pre code {
    background: var(--muted);
    border-radius: 8px;
    padding: 1rem;
  }
  
  /* Blockquotes */
  blockquote {
    border-left: 4px solid oklch(0.55 0.22 270);
    padding-left: 1rem;
  }
}
```

---

*Continued in next section...*

### 4. Real-time Collaborative Editing

#### **Liveblocks Integration**
```typescript
// RoomProvider.tsx
export default function RoomProvider({ 
  roomId, 
  children 
}: RoomProviderProps) {
  return (
    <LiveblocksProvider
      authEndpoint="/auth-endpoint"
      resolveUsers={async ({ userIds }) => {
        return userIds.map(userId => ({
          name: userId,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        }));
      }}
    >
      <RoomProvider 
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={<LoadingSpinner />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
```

#### **Authorization Endpoint**
```typescript
// app/auth-endpoint/route.ts
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const user = await currentUser();
  const { room } = await req.json();
  
  const liveblocksUserId = user.emailAddresses[0].emailAddress;
  
  const session = liveblocks.prepareSession(liveblocksUserId, {
    userInfo: {
      name: userName,
      email: liveblocksUserId,
      avatar: userAvatar,
    },
  });
  
  // Check permissions against Firestore
  const userInRoom = await adminDb
    .collection("rooms")
    .doc(room)
    .collection("users")
    .doc(liveblocksUserId)
    .get();
  
  if (userInRoom.exists) {
    session.allow(room, session.FULL_ACCESS);
    return session.authorize();
  } else {
    return NextResponse.json({ message: "No access" }, { status: 403 });
  }
}
```

**Features:**
- ✅ Cursor tracking
- ✅ User presence
- ✅ Real-time sync
- ✅ Automatic conflict resolution
- ✅ Firestore-based permissions

### 5. Design System

#### **"Modern Notion Pro" Theme**

**Color Palette:**
```css
:root {
  /* Primary Colors */
  --primary: oklch(0.55 0.22 270);        /* Deep Indigo #6366f1 */
  --primary-foreground: oklch(0.98 0 0);  /* White */
  
  /* Accent Colors */
  --accent: oklch(0.6 0.2 250);           /* Bright Blue #3b82f6 */
  --accent-foreground: oklch(0.98 0 0);   /* White */
  
  /* Success */
  --success: oklch(0.65 0.2 150);         /* Green */
  
  /* Danger */
  --destructive: oklch(0.6 0.25 25);      /* Red */
  
  /* Background */
  --background: oklch(1 0 0);             /* Pure White */
  --foreground: oklch(0.2 0 0);           /* Near Black */
  
  /* Radius */
  --radius: 8px;
}

.dark {
  --primary: oklch(0.65 0.25 270);        /* Brighter Indigo */
  --background: oklch(0.05 0 0);          /* True Black */
  --foreground: oklch(0.98 0 0);          /* Pure White */
}
```

**Typography:**
- Font Family: Inter
- Line Height: 1.65
- Headings: 600-700 weight
- Body: 400 weight

**Spacing:**
- 4px, 8px, 12px, 16px, 24px, 32px

**Border Radius:**
- Buttons: 8-12px
- Cards: 12-16px
- Inputs: 8px

**Transitions:**
- Duration: 200-300ms
- Easing: ease-in-out

#### **Styled Components**

**Header:**
- ✅ Gradient background
- ✅ Sparkles icon
- ✅ Welcome message
- ✅ Backdrop blur
- ✅ Sticky positioning

**Breadcrumbs:**
- ✅ Home icon
- ✅ FileText icons
- ✅ Active state with background
- ✅ Hover effects
- ✅ Truncate for long text

**NewDocumentButton:**
- ✅ Gradient background
- ✅ Plus icon in square (rotates on hover)
- ✅ Sparkles icon
- ✅ Hover: scale + shadow
- ✅ Loading state with Loader2

**ThemeToggle:**
- ✅ Toggle switch style
- ✅ Sliding indicator
- ✅ Sun/Moon icons
- ✅ Rotation animations
- ✅ Smooth transitions

### 6. Toast Notifications

#### **Sonner Configuration**
```typescript
// Toaster.tsx
import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as "light" | "dark"}
      position="top-center"
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
        className: "rounded-xl shadow-lg",
      }}
      richColors
    />
  );
}
```

**Usage:**
```typescript
import { toast } from "sonner";

// Success
toast.success("Document created!", {
  description: "Your new document is ready.",
  duration: 3000,
});

// Error
toast.error("Failed to save", {
  description: "Please try again.",
  duration: 4000,
});
```

**Usage Locations:**
- ✅ Document creation (success/error)
- ✅ Title update (success/error)
- ✅ Sign in (success/error)
- ✅ Sign up (success/error/verification)

### 7. Dark Mode

#### **Implementation**
```typescript
// ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Features:**
- ✅ True black background (not gray)
- ✅ System preference detection
- ✅ No flash of wrong theme
- ✅ All components adapted
- ✅ Dynamic CSS variables
- ✅ Smooth transitions

---

## 🐛 Known Bugs

### 1. **useOwner Hook Not Implemented**
**Severity:** 🔴 Critical

**Description:** Hook returns `null` instead of checking if user is document owner.

**File:** `src/lib/useOwner.ts`

**Problem:**
```typescript
function useOwner() {
  return null; // ❌ Doesn't work!
}
```

**Proposed Solution:**
```typescript
'use client';
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useMemo } from "react";

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  
  const [data] = useCollection(
    user && collection(db, "users", user.id, "rooms")
  );

  const isOwner = useMemo(() => {
    if (!data || !room) return false;
    
    const roomDoc = data.docs.find((doc) => doc.data().roomId === room.id);
    return roomDoc?.data().role === "owner";
  }, [data, room]);

  return isOwner;
}

export default useOwner;
```

**Impact:** Prevents system from restricting operations to document owners only.

---

### 2. **Tailwind Config Missing Colors**
**Severity:** 🟡 Medium

**Description:** Config only includes `background` and `foreground`, missing all other Design System colors.

**File:** `tailwind.config.ts`

**Problem:**
```typescript
theme: {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      // ❌ Missing: primary, accent, muted, card, etc.
    },
  },
},
```

**Solution:** See separate document with full Tailwind Config.

**Impact:** Tailwind doesn't recognize all colors, but they still work through globals.css.

---

### 3. **Firebase Security**
**Severity:** 🔴 Critical

**Description:** 
1. Firebase API Key hardcoded in code
2. Firebase Security Rules not visible

**File:** `firebase.ts`

**Problem:**
```typescript
const firebaseConfig = {
  apiKey: 'AIzaSyCX2Dle_SPvU1b4HPzb-34J62PpMicfu1c', // ❌ Exposed
  // ...
};
```

**Solutions:**
1. Move to Environment Variables
2. Configure Firebase Security Rules

**Recommended Firebase Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/rooms/$(docId)/users/$(request.auth.token.email));
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/rooms/$(docId)/users/$(request.auth.token.email)).data.role == "owner";
    }
    
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /rooms/{roomId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    match /rooms/{roomId} {
      match /users/{userEmail} {
        allow read: if request.auth != null;
        allow write: if request.auth.token.email == userEmail ||
          get(/databases/$(database)/documents/rooms/$(roomId)/users/$(request.auth.token.email)).data.role == "owner";
      }
    }
  }
}
```

---

### 4. **Tiptap Version Mismatch**
**Severity:** 🟡 Medium

**Description:** Most extensions at 2.1.13, but `@tiptap/extension-history` at 3.13.0.

**File:** `package.json`

**Problem:**
```json
"@tiptap/extension-bold": "2.1.13",
"@tiptap/extension-history": "^3.13.0", // ❌ Different version!
```

**Solution:**
```bash
yarn add @tiptap/extension-history@2.1.13
```

**Impact:** May cause compatibility issues.

---

### 5. **Homepage Underdeveloped**
**Severity:** 🟢 Low

**Description:** Homepage only shows "Get Started" message.

**File:** `src/app/page.tsx`

**Problem:**
```typescript
export default function Home() {
  return (
    <main className='flex space-x-2 items-center animate-pulse'>
      <ArrowLeftCircle className='w-13 h-13' />
      <Button />
      <h1 className='font-bold'>Get Started With Creating A New Document</h1>
    </main>
  );
}
```

**Improvement Ideas:**
- Show recent documents
- Statistics (total docs, recent activity)
- Quick links
- Personalized welcome message

---

### 6. **Mobile Responsiveness Not Fully Tested**
**Severity:** 🟡 Medium

**Description:** Application not thoroughly tested on mobile devices.

**Areas to Check:**
- ✅ Sign-In/Sign-Up - appears responsive
- ✅ Header - appears responsive
- ✅ Sidebar - has mobile menu
- ❓ Editor - not tested
- ❓ Toolbar - may overflow
- ❓ Document input - not tested

**Recommendation:** Comprehensive testing on iPhone/Android.

---

## ❌ Missing Features

### Document Management

#### **1. Delete Document**
**Priority:** 🔴 High

**Description:** No ability to delete documents.

**Proposed Implementation:**
```typescript
// actions/actions.ts
export async function deleteDocument(docId: string) {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }
  
  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  // Check if user is owner
  const roomUser = await adminDb
    .collection("rooms")
    .doc(docId)
    .collection("users")
    .doc(userEmail)
    .get();
  
  if (!roomUser.exists || roomUser.data()?.role !== "owner") {
    throw new Error("Only owners can delete documents");
  }
  
  // Delete document
  await adminDb.collection("documents").doc(docId).delete();
  
  // Delete from user's room list
  await adminDb
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(docId)
    .delete();
  
  // Delete all users from room
  const users = await adminDb
    .collection("rooms")
    .doc(docId)
    .collection("users")
    .get();
  
  const deletePromises = users.docs.map(doc => doc.ref.delete());
  await Promise.all(deletePromises);
  
  return { success: true };
}
```

---

#### **2. Duplicate Document**
**Priority:** 🟡 Medium

**Description:** Ability to create a copy of existing document.

**Proposed Implementation:**
```typescript
export async function duplicateDocument(docId: string) {
  const originalDoc = await adminDb.collection("documents").doc(docId).get();
  
  if (!originalDoc.exists) {
    throw new Error("Document not found");
  }
  
  const newDoc = await adminDb.collection("documents").add({
    ...originalDoc.data(),
    title: `${originalDoc.data()?.title} (Copy)`,
    createdAt: new Date(),
  });
  
  // Copy content from Liveblocks
  // ...
  
  return { docId: newDoc.id };
}
```

---

#### **3. Search Documents**
**Priority:** 🔴 High

**Description:** Ability to search documents by title.

**Proposed Implementation:**
```typescript
// SideBar.tsx
const [searchQuery, setSearchQuery] = useState("");

const filteredDocs = useMemo(() => {
  if (!searchQuery) return groupedData;
  
  const query = searchQuery.toLowerCase();
  return {
    owner: groupedData.owner.filter(doc => 
      doc.title.toLowerCase().includes(query)
    ),
    editor: groupedData.editor.filter(doc => 
      doc.title.toLowerCase().includes(query)
    ),
  };
}, [groupedData, searchQuery]);

// UI
<input
  type="search"
  placeholder="Search documents..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="..."
/>
```

---

#### **4. Sort Documents**
**Priority:** 🟡 Medium

**Options:**
- By date (newest → oldest)
- By date (oldest → newest)
- By name (A → Z)
- By name (Z → A)

---

#### **5. Folders / Organization**
**Priority:** 🟢 Low

**Description:** Folder system for organizing documents.

**Proposed Firestore Structure:**
```typescript
folders/{folderId}
  - name: string
  - userId: string
  - createdAt: timestamp
  - parentId: string | null

documents/{docId}
  - folderId: string | null
  // other fields...
```

---

#### **6. Favorites**
**Priority:** 🟢 Low

**Description:** Mark documents as favorites for quick access.

---

### Sharing & Collaboration

#### **7. Share Document with Others**
**Priority:** 🔴 Very High

**Description:** Invite users to document with permissions.

**Proposed Implementation:**
```typescript
// actions/actions.ts
export async function shareDocument(
  docId: string, 
  email: string, 
  role: "viewer" | "editor"
) {
  const { userId } = await auth();
  
  // Check if current user is owner
  // ...
  
  // Send invitation or add directly
  await adminDb
    .collection("rooms")
    .doc(docId)
    .collection("users")
    .doc(email)
    .set({
      email: email,
      role: role,
      invitedBy: userId,
      invitedAt: new Date(),
    });
  
  // Send invitation email
  // ...
  
  return { success: true };
}
```

**Required UI Components:**
- Modal/Dialog for sharing
- Input for email address
- Select for role selection
- List of shared users
- Remove access button

---

#### **8. Permission Management**
**Priority:** 🔴 High

**Description:** Change roles (viewer ↔ editor) and remove access.

**Roles:**
- **Owner**: Full access, can delete
- **Editor**: Can edit
- **Viewer**: Read-only

---

#### **9. Active Users Display**
**Priority:** 🟡 Medium

**Description:** Show avatars of users currently editing.

**Proposed Implementation:**
```typescript
// ActiveUsers.tsx
import { useOthers, useSelf } from "@liveblocks/react/suspense";

function ActiveUsers() {
  const others = useOthers();
  const self = useSelf();
  
  const users = [self, ...others];
  
  return (
    <div className="flex -space-x-2">
      {users.map((user) => (
        <Avatar key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

#### **10. Comments System**
**Priority:** 🟢 Low

**Description:** Add comments to document with @mentions.

**Features:**
- Comments on specific text
- @mention users
- Resolve/close comments
- Threading (replies to comments)

---

#### **11. Version History**
**Priority:** 🟢 Low

**Description:** View previous versions and restore.

**Technology:** Liveblocks provides version history API.

---

### Editor Enhancements

#### **12. Undo/Redo Buttons**
**Priority:** 🟡 Medium

**Description:** Add buttons to Toolbar.

**Implementation:**
```typescript
// EditorToolbar.tsx
<button
  onClick={() => editor.chain().focus().undo().run()}
  disabled={!editor.can().undo()}
  className="..."
>
  <Undo size={18} />
</button>

<button
  onClick={() => editor.chain().focus().redo().run()}
  disabled={!editor.can().redo()}
  className="..."
>
  <Redo size={18} />
</button>
```

---

#### **13. Link Support**
**Priority:** 🔴 High

**Description:** Add/edit hyperlinks.

**Required Extensions:**
```typescript
import Link from '@tiptap/extension-link'

extensions: [
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline',
    },
  }),
]
```

**UI:**
- "Add Link" button in Toolbar
- Modal for editing URL
- Tooltip with URL on hover

---

#### **14. Image Upload**
**Priority:** 🟡 Medium

**Description:** Add images to document.

**Options:**
- Firebase Storage
- Cloudinary
- Vercel Blob

**Extensions:**
```typescript
import Image from '@tiptap/extension-image'

extensions: [
  Image.configure({
    HTMLAttributes: {
      class: 'rounded-lg max-w-full',
    },
  }),
]
```

---

#### **15. Tables**
**Priority:** 🟢 Low

**Extensions:**
```typescript
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
```

---

#### **16. Text Alignment**
**Priority:** 🟡 Medium

**Extensions:**
```typescript
import TextAlign from '@tiptap/extension-text-align'

extensions: [
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]
```

---

#### **17. Text Color & Highlight**
**Priority:** 🟡 Medium

**Extensions:**
```typescript
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
```

---

#### **18. Slash Commands (/)**
**Priority:** 🟡 Medium

**Description:** Command menu triggered by `/`.

**Example:**
```
/ → shows menu
/h1 → Heading 1
/table → Insert Table
/image → Upload Image
```

---

#### **19. Emoji Picker**
**Priority:** 🟢 Low

**Libraries:**
- emoji-picker-react
- emoji-mart

---

#### **20. Drag & Drop Blocks**
**Priority:** 🟢 Low

**Description:** Drag blocks to reorder.

---

### Export & Import

#### **21. Export to PDF**
**Priority:** 🟡 Medium

**Libraries:**
- jsPDF
- html2pdf.js
- Puppeteer (server-side)

---

#### **22. Export to Markdown**
**Priority:** 🟡 Medium

**Implementation:**
```typescript
const markdown = editor.storage.markdown.getMarkdown();
```

---

#### **23. Export to Word (.docx)**
**Priority:** 🟢 Low

**Libraries:**
- docx
- html-docx-js

---

#### **24. Import Documents**
**Priority:** 🟢 Low

**Formats:**
- Markdown (.md)
- Word (.docx)
- HTML (.html)
- Plain Text (.txt)

---

#### **25. Print**
**Priority:** 🟢 Low

**Implementation:**
```typescript
const printDocument = () => {
  window.print();
};
```

With print-specific CSS:
```css
@media print {
  .no-print { display: none; }
  /* Additional print styles */
}
```

---

### UI/UX

#### **26. Command Palette (Ctrl+K)**
**Priority:** 🟡 Medium

**Description:** Quick search for documents and commands.

**Libraries:**
- cmdk (Vercel)
- kbar

**Features:**
- Document search
- Quick commands
- Keyboard shortcuts
- Recent documents

---

#### **27. Keyboard Shortcuts Modal**
**Priority:** 🟢 Low

**Description:** Display list of shortcuts.

**Shortcuts:**
```
Ctrl+B - Bold
Ctrl+I - Italic
Ctrl+K - Command Palette
Ctrl+/ - Show Shortcuts
Ctrl+N - New Document
Ctrl+S - Save (auto-save)
```

---

#### **28. Document Templates**
**Priority:** 🟢 Low

**Examples:**
- Meeting Notes
- Project Plan
- Todo List
- Weekly Report

---

#### **29. Recent Documents**
**Priority:** 🟡 Medium

**Description:** Show 5-10 recent documents on homepage.

---

#### **30. Loading Skeletons**
**Priority:** 🟡 Medium

**Description:** Animated placeholders during loading.

**Libraries:**
- react-loading-skeleton
- Tailwind CSS (animate-pulse)

---

#### **31. Error Boundaries**
**Priority:** 🔴 High

**Description:** Handle React errors.

**Implementation:**
```typescript
// ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

#### **32. Offline Support**
**Priority:** 🟢 Low

**Description:** Save changes locally and sync when back online.

**Technologies:**
- Service Workers
- IndexedDB
- Liveblocks offline support

---

### Analytics & Monitoring

#### **33. Google Analytics**
**Priority:** 🟡 Medium

**Metrics to Track:**
- Page Views
- Document Creates
- Edit Sessions
- User Retention

---

#### **34. Sentry (Error Tracking)**
**Priority:** 🟡 Medium

**Description:** Automatic error tracking in production.

---

#### **35. Performance Monitoring**
**Priority:** 🟢 Low

**Tools:**
- Vercel Analytics
- Web Vitals
- Lighthouse CI

---

## 📥 Installation Instructions

### Prerequisites

```bash
Node.js: 18.17 or higher
npm or yarn
Git
```

### 1. Clone Repository

```bash
git clone https://github.com/oferdebug/Notion-Clone-YT.git
cd Notion-Clone-YT
```

### 2. Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# or npm
npm install
```

### 3. Set Up Environment Variables

Create `.env.local` file in project root:

```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your-liveblocks-public-key
LIVEBLOCKS_PRIVATE_KEY=your-liveblocks-private-key
```

### 4. Set Up Firebase

1. Create project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create Service Account:
   - Settings → Service Accounts → Generate New Private Key
4. Copy keys to `.env.local`

### 5. Set Up Clerk

1. Create account at [Clerk](https://clerk.com/)
2. Create new application
3. Choose Email + Google OAuth
4. Copy API Keys to `.env.local`
5. Configure Redirect URLs:
   ```
   Sign-in URL: /sign-in
   Sign-up URL: /sign-up
   After sign-in: /
   After sign-up: /
   ```

### 6. Set Up Liveblocks

1. Create account at [Liveblocks](https://liveblocks.io/)
2. Create new project
3. Copy Public Key and Secret Key
4. Add Authorization Endpoint:
   ```
   https://your-domain.com/auth-endpoint
   ```

### 7. Run Development Server

```bash
yarn dev
```

Open browser at `http://localhost:3000`

---

## 🚀 Deployment Instructions

### Vercel (Recommended)

#### Method 1: Via GitHub

1. Push code to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Click "New Project"
4. Select repository
5. Add Environment Variables from `.env.local`
6. Click "Deploy"

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

### Vercel Settings

**Build Command:**
```bash
next build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
yarn install
```

**Environment Variables:**
- Add all variables from `.env.local`
- Ensure `FIREBASE_PRIVATE_KEY` is wrapped in quotes

### Firebase Security Rules

After deployment, configure Security Rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        exists(/databases/$(database)/documents/rooms/$(docId)/users/$(request.auth.token.email));
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/rooms/$(docId)/users/$(request.auth.token.email)).data.role == "owner";
    }
    
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /rooms/{roomId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    match /rooms/{roomId} {
      match /users/{userEmail} {
        allow read: if request.auth != null;
        allow write: if request.auth.token.email == userEmail ||
          get(/databases/$(database)/documents/rooms/$(roomId)/users/$(request.auth.token.email)).data.role == "owner";
      }
    }
  }
}
```

### Post-Deployment Checklist

- [ ] Check all pages load
- [ ] Check Sign-In/Sign-Up
- [ ] Check document creation
- [ ] Check real-time editing
- [ ] Check Dark Mode
- [ ] Check on Mobile
- [ ] Check Firebase Security Rules
- [ ] Set up Custom Domain (optional)
- [ ] Set up Analytics (optional)
- [ ] Set up Sentry (optional)

---

## 📊 Project Statistics

**Code Files:** 25+  
**Components:** 15+  
**Pages:** 4  
**API Routes:** 1  
**Server Actions:** 1  

**Working Features:** ~25  
**Critical Bugs:** 3  
**Missing Features:** ~35  

**Dependencies:** 40+  
**Languages:** TypeScript, CSS  
**Framework:** Next.js 15  

---

## 🎓 Technical Summary

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn/ui + Radix UI
- **Icons**: Lucide React

### Backend
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Real-time**: Liveblocks
- **CRDT**: Yjs
- **Server**: Next.js API Routes + Server Actions

### Editor
- **Framework**: Tiptap (ProseMirror)
- **Collaboration**: Liveblocks + Yjs
- **Extensions**: 15+ installed

### DevOps
- **Hosting**: Vercel (recommended)
- **Version Control**: Git/GitHub
- **CI/CD**: Vercel auto-deployment

---

## 📞 Support

**Technical Questions:**
- GitHub Issues
- Discord Community (if available)

**Bugs:**
- Report on GitHub Issues
- Include screenshots
- Attach error logs

**Feature Requests:**
- Open Discussion on GitHub
- Describe feature in detail
- Explain use case

---

## 📝 License

MIT License - See LICENSE file for details.

---

## 🙏 Acknowledgments

**Technologies:**
- Next.js Team
- Vercel
- Clerk
- Firebase
- Liveblocks
- Tiptap

**Community:**
- shadcn (shadcn/ui)
- Radix UI Team
- Tailwind Labs

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Author:** Ofer

---

*This document covers all technical aspects of the project. For additional questions, reach out through GitHub Issues.*
