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
- ✅ Rich text editor with Slash Commands
- ✅ Image upload with multiple methods
- ✅ Full-text search in content
- ✅ Secure user authentication
- ✅ Dark/Light mode
- ✅ Modern and professional design
- ✅ Personal and shared document management
- ✅ Auto-save content to Firestore

### Core Technologies:
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Authentication**: Clerk
- **Database**: Firebase Firestore + Storage
- **Real-time**: Liveblocks + Yjs
- **Editor**: Tiptap (ProseMirror)
- **Tooltips**: Tippy.js

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
│  │  (Auth)  │  │(DB+Store)│  │(RealTime)│             │
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

**4. Image Upload (NEW):**
```
User Drag/Paste → uploadImage() → Firebase Storage → Download URL → Insert to Editor
```

**5. Content Search (NEW):**
```
User Types → Auto-save (2s debounce) → Firestore → Search Query → Results with Context
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

### Database & Storage

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
  - content: string              // NEW: For search
  - contentLength: number         // NEW: Content stats
  - createdAt: timestamp
  - updatedAt: timestamp          // NEW: Last modified
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
- **Content indexing for search** (NEW)

#### **Firebase Storage (NEW)**
```typescript
// Storage Structure:
images/{timestamp}-{random}-{filename}
  - Max size: 5MB
  - Allowed types: image/png, image/jpeg, image/gif, image/webp
```

**Features:**
- ✅ Automatic unique filename generation
- ✅ Progress tracking during upload
- ✅ Public read access with auth
- ✅ Secure upload with validation

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
- Image (NEW)
- Collaboration, CollaborationCursor
- Placeholder
- SlashCommands (NEW)
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

#### **Tippy.js (NEW)**
- Tooltips and Popovers
- Used for Slash Commands menu
- Highly customizable
- Keyboard navigation support

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
│   │   ├── Editor.tsx                # Tiptap editor with image support
│   │   ├── EditorToolbar.tsx         # Editor toolbar with image button
│   │   ├── slashCommands.tsx         # NEW: Slash commands extension
│   │   ├── Header.tsx                # Top header
│   │   ├── LoadingSpinner.tsx        # Loading spinner
│   │   ├── NewDocumentButton.tsx     # New document button
│   │   ├── RoomProvider.tsx          # Liveblocks provider
│   │   ├── SideBar.tsx               # Sidebar with search
│   │   ├── SidebarOption.tsx         # Sidebar item
│   │   ├── ThemeProvider.tsx         # Theme provider
│   │   ├── ThemeToggle.tsx           # Theme toggle
│   │   └── Toaster.tsx               # Notification system
│   │
│   ├── hooks/                        # NEW: Custom hooks directory
│   │   └── useSyncEditorContent.ts   # NEW: Auto-save content hook
│   │
│   └── lib/
│       ├── utils.ts                  # Utility functions
│       ├── useOwner.ts               # Ownership check hook
│       ├── liveblocks.ts             # Liveblocks config
│       └── uploadImage.ts            # NEW: Image upload utility
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

---

*Continued in TECHNICAL_DOCUMENTATION_PART2.md...*