import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-books" element={
          <PlaceholderPage 
            title="My Books" 
            description="This is where you'll manage your personal book library. Add books, update reading progress, and organize your collection." 
          />
        } />
        <Route path="/discover" element={
          <PlaceholderPage 
            title="Discover Books" 
            description="Explore new books and get personalized recommendations based on your reading history and preferences." 
          />
        } />
        <Route path="/goals" element={
          <PlaceholderPage 
            title="Reading Goals" 
            description="Set and track your reading goals. Challenge yourself with yearly targets and monthly objectives." 
          />
        } />
        <Route path="/profile" element={
          <PlaceholderPage 
            title="Profile Settings" 
            description="Manage your account settings, update your profile information, and customize your reading preferences." 
          />
        } />
        <Route path="/preferences" element={
          <PlaceholderPage 
            title="Preferences" 
            description="Customize your Booker experience with notification settings, display preferences, and more." 
          />
        } />
        <Route path="/add-book" element={
          <PlaceholderPage 
            title="Add Book" 
            description="Add a new book to your library. Search our database or manually enter book information." 
          />
        } />
        <Route path="/insights" element={
          <PlaceholderPage 
            title="Reading Insights" 
            description="View detailed analytics about your reading habits, progress trends, and reading statistics." 
          />
        } />
        <Route path="/groups" element={
          <PlaceholderPage 
            title="Reading Groups" 
            description="Connect with other readers, join book clubs, and participate in reading discussions." 
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
