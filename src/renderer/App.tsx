import '../styles/style.css';

import React, { useState } from 'react';
import { Link, MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Tab1 from './tabs/Tab1';

function TabScreen1() {
  return <Tab1 />;
}

function TabScreen2() {
  return <Tab1 />;
}

function TabScreen3() {
  return <Tab1 />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TabScreen1 />} />
        <Route path="/tab2" element={<TabScreen2 />} />
        <Route path="/tab3" element={<TabScreen3 />} />
      </Routes>
    </Router>
  );
}
