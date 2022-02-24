import React, { useEffect } from "react";
import "./App.css";
import { useData, setData, useUserState } from "./utilities/firebase";
import { useParams } from "react-router-dom";

import LogOnPanel from "./components/LogOn";
import LobbyPanel from "./components/Lobby";
import MatchedPanel from "./components/MatchedPanel";
import SignUpPanel from "./components/SignUp";
import {
  Matched,
  Initial,
  Matching,
  WaitForConfirmation,
} from "./utilities/constant";
import MatchingPanel from "./components/MatchingPanel";
import { signOut } from "./utilities/firebase";
import { Button } from "@mui/material";

const App = () => {
  const [users, loading, error] = useData("/users");
  const { meetingId } = useParams();
  const [user] = useUserState();

  useEffect(() => {
    if (user && meetingId) {
      console.log(user);
      setData(`/users/${user.uid}/previous_meeting_id`, meetingId);
      setData(`/users/${user.uid}/status`, Initial);
    }
  }, [user]);

  if (error) return <h1>{error}</h1>;
  if (loading || (user && users && !users[user.uid]))
    return <h1>Loading Bumpin...</h1>;

  const RenderUserStatusPanel = () => {
    if (users[user.uid].status === Initial) {
      return <LobbyPanel uid={user.uid} />;
    } else if (users[user.uid].status === Matching) {
      return <MatchingPanel uid={user.uid} users={users} />;
    } else if (users[user.uid].status === Matched) {
      return (
        <MatchedPanel
          uid={user.uid}
          shared_zoom_link={users[user.uid].shared_zoom_link}
        />
      );
    }
  };

  const LogOutButton = () => {
    return <Button onClick={() => signOut()}>Sign Out</Button>;
  };
  const SignUpButton = () => {
    return (
      <Button onClick={() => setData(`/users/${user.uid}/zoom_link`, null)}>
        Change My Profile
      </Button>
    );
  };

  const RenderPage = () => {
    if (user) {
      if (users[user.uid].zoom_link) {
        return (
          <>
            {RenderUserStatusPanel()} {SignUpButton()} {LogOutButton()}
          </>
        );
      } else {
        return <SignUpPanel uid={user.uid} email={user.email} displayName={user.displayName} photoURL={user.photoURL}/>;
      }
    } else {
      return <LogOnPanel />;
    }
  };

  return (
    <div className="App" style={{backgroundColor: "#f8615d"}}>
      <header className="App-header">{RenderPage()}</header>
    </div>
  );
};

export default App;
