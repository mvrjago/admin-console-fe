import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Main/LoginPage";
import Dashboard from "./pages/Main/DashboardPage";
import Maintanance from "./pages/Main/MaintanancePage";
import BroadcastPage from "./pages/Bot/BroadcastPage";
import Stats from "./pages/Bot/StatsPage";
import AdminPage from "./pages/Bot/AdminPage";
import User from "./pages/User/UserPage";
import AddUser from "./pages/User/AddUserPage";
import EditUser from "./pages/User/UserEditPage";
import Event from "./pages/Event/EventPage";
import AddEvent from "./pages/Event/AddEventPage";
import EditEvent from "./pages/Event/EventEditPage";
import Crewdesigner from "./pages/CrewDesigner/CrewdesignerPage";
import AddCrewdesigner from "./pages/CrewDesigner/AddCrewdesignerPage";
import EditCrewdesigner from "./pages/CrewDesigner/CrewdesignerEditPage";
import DetailCrewdesigner from "./pages/CrewDesigner/CrewDesignerDetailPage";
import HistoryCrewdesigner from "./pages/CrewDesigner/CrewDesignerHistoryPage";
import Adsos from "./pages/Adsos/AdsosPage";
import AddAdsos from "./pages/Adsos/AddAdsosPage";
import EditAdsos from "./pages/Adsos/AdsosEditPage";
import DetailAdsos from "./pages/Adsos/AdsosDetailPage";
import HistoryAdsos from "./pages/Adsos/AdsosHistoryPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/client" element={<Maintanance />} />
          <Route path="/bot/broadcast" element={<BroadcastPage />} />
          <Route path="/bot/stats" element={<Stats />} />
          <Route path="/bot/admin" element={<AdminPage />} />
          <Route path="/users" element={<User />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/events" element={<Event />} />
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
          <Route path="/crewdesigner" element={<Crewdesigner />} />
          <Route path="/crewdesigner/add" element={<AddCrewdesigner />} />
          <Route path="/crewdesigner/edit/:id" element={<EditCrewdesigner />} />
          <Route path="/crewdesigner/detail/:id" element={<DetailCrewdesigner />} />
          <Route path="/crewdesigner/history" element={<HistoryCrewdesigner />} />
          <Route path="/adsos" element={<Adsos />} />
          <Route path="/adsos/add" element={<AddAdsos />} />
          <Route path="/adsos/edit/:id" element={<EditAdsos />} />
          <Route path="/adsos/detail/:id" element={<DetailAdsos />} />
          <Route path="/adsos/history" element={<HistoryAdsos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
