import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./component/header_";
import EditNavbar from "./component/navigation_";
import PictureBar from "./component/pictureBar_";
import LoginScreen from "./screens/LoginScreen";
import AccountInfo from "./screens/profileScreen/accountInfo";
import BasicProfileInfo from "./screens/profileScreen/basicProfileInfo";
import EmergencyInfo from "./screens/profileScreen/emergency";
import OfficialInfo from "./screens/profileScreen/officialInfo";
import ProfileImage from "./screens/profileScreen/profileImage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<LoginScreen />} />
          <Route path="/edit/basicInfo" exact element={<BasicProfileInfo />} />
          <Route path="/edit/emergencyInfo" exact element={<EmergencyInfo />} />
          <Route path="/edit/officailInfo" exact element={<OfficialInfo />} />
          <Route path="/edit/accountInfo" exact element={<AccountInfo />} />
          <Route path="/edit/profileImage" exact element={<ProfileImage />} />
          
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
