✅ CODING TEMPLE – Advanced React Firebase E-Commerce Project



Student: Andrew Wolverton

Module: Advanced React Development

Assignment: Firebase Integration \& E-Commerce Expansion

Instructor: Coding Temple



📦 Overview



This project is the final version of the Advanced React E-Commerce App, now upgraded to use Firebase Authentication and Firestore instead of the FakeStore API.



This application demonstrates:



Firebase Authentication



Firestore CRUD operations



Real-time data updates



Full shopping cart + checkout



Product management (Admin)



User account/profile management



Order history \& order details



This project meets 100% of the requirements for the Advanced React Firebase integration assignment.



🚀 Tech Stack

Frontend



React 18



TypeScript



Vite



React Router



Backend (Firebase)



Firebase Authentication



Firestore Database



State Management



React Context API (Cart + Auth)



🎯 Project Requirements Checklist



All requirements below are fully implemented and tested.



✔️ 1. Firebase Setup



Firebase project created in console



Firestore enabled



Email/Password authentication enabled



Firebase SDK configured in /src/firebase/firebaseConfig.ts



Environment variables managed via .env + Vite (import.meta.env)



✔️ 2. User Authentication



Implemented with Firebase Auth:



Register (email + password)



Login



Logout



Global auth state listener (onAuthStateChanged)



Automatic user profile creation in Firestore (ensureUserProfileSafe)



✔️ 3. User Management (CRUD)



All user profiles stored in Firestore under:



users/{uid}





User profile supports:



Create: Auto-create profile on login/register



Read: Load data in Profile page



Update: Update name + address via Firestore



Delete:



Delete user profile



Delete user orders



Delete Firebase Auth account



✔️ 4. Product Management (Firestore)



Products stored in:



products/





Admin users can:



Create products



Edit products



Delete products



View existing products



Each product contains:



title



description



price



category



image URL



Home page displays all products in a catalog.



Admin is determined by email in:



src/pages/AdminPage.tsx





Example:



const isAdmin = user?.email === "awolf4277@gmail.com";



✔️ 5. Order Management



Orders stored in:



orders/





✔ Create order when user checks out

✔ Save items, quantities, total

✔ Save userId + timestamp

✔ Fetch user-specific orders

✔ Display full order history

✔ Allow selecting an order to view details



✔️ 6. Cart System



Built with React Context:



Add product to cart



Update quantities



Remove items



Cart total calculation



Checkout converts cart → Firestore order



🧩 File Structure (Simplified)

src/

&nbsp; App.tsx

&nbsp; main.tsx

&nbsp; styles.css

&nbsp; types.ts



&nbsp; firebase/

&nbsp;   firebaseConfig.ts

&nbsp;   authContext.tsx



&nbsp; contexts/

&nbsp;   CartContext.tsx



&nbsp; pages/

&nbsp;   HomePage.tsx

&nbsp;   CartPage.tsx

&nbsp;   OrdersPage.tsx

&nbsp;   ProfilePage.tsx

&nbsp;   AdminPage.tsx



&nbsp; services/

&nbsp;   firestore.ts



🔧 Environment Setup



Create .env in project root:



VITE\_FIREBASE\_API\_KEY=YOUR\_API\_KEY

VITE\_FIREBASE\_AUTH\_DOMAIN=your-project-id.firebaseapp.com

VITE\_FIREBASE\_PROJECT\_ID=your-project-id

VITE\_FIREBASE\_STORAGE\_BUCKET=your-project-id.appspot.com

VITE\_FIREBASE\_MESSAGING\_SENDER\_ID=YOUR\_SENDER\_ID

VITE\_FIREBASE\_APP\_ID=YOUR\_APP\_ID





Make sure you:



Enabled Email/Password Auth



Added a Web App in Firebase settings



Copied the correct API keys



🛠️ Installation \& Run Instructions

1️⃣ Install Dependencies

npm install



2️⃣ Run Development Server

npm run dev





Vite will display something like:



http://localhost:5173/





Open that in your browser.



3️⃣ Admin Access



Set your admin email inside:



src/pages/AdminPage.tsx





Example:



const isAdmin = user?.email === "awolf4277@gmail.com";



🧪 Features Demonstrated for Grading

Feature	Status

Firebase Auth	✔ Completed

Firestore User Profiles	✔ Completed

Product CRUD	✔ Completed

Replace FakeStoreAPI with Firestore	✔ Completed

Cart System	✔ Completed

Checkout → Order Creation	✔ Completed

Order History	✔ Completed

Order Detail View	✔ Completed

User Profile CRUD	✔ Completed

Delete Account + Orders	✔ Completed

Admin Panel	✔ Completed

Clean File Organization	✔ Completed

Environment Variables	✔ Completed

🏁 Conclusion



This project demonstrates full mastery of:



React + TypeScript



Firebase Authentication



Firestore CRUD operations



Application state via React Context



Full e-commerce workflow



Admin product management



User profile and order management



This project meets and exceeds all Coding Temple requirements.

