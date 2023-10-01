import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "../routes/Auth";
import CreatePost from "../routes/CreatePost";
import EditPost from "../routes/EditPost";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Header from "./Header";
import Navigation from "./Navigation";

const AppRouter = ({
  isLoggedIn,
  userObj,
  refreshUser,
  userDisplayName,
  setUserDisplayName,
}) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {isLoggedIn && (
        <Header userObj={userObj} userDisplayName={userDisplayName} />
      )}
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route exact path="/" element={<Home userObj={userObj} />} />
            <Route
              exact
              path="/profile"
              element={
                <Profile
                  userObj={userObj}
                  refreshUser={refreshUser}
                  userDisplayName={userDisplayName}
                  setUserDisplayName={setUserDisplayName}
                />
              }
            />
            <Route
              exact
              path="/update/:id"
              element={<EditPost userObj={userObj} />}
            />{" "}
            <Route
              exact
              path="/create"
              element={<CreatePost userObj={userObj} />}
            />
            <Route
              exact
              path="*"
              element={<Navigate to="/" replace={true} />}
            />
          </>
        ) : (
          <>
            <Route exact path="/" element={<Auth />} />
            <Route
              exact
              path="*"
              element={<Navigate to="/" replace={true} />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
