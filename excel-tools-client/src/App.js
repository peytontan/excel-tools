import { styled } from "styled-components";
import { MainLayout } from "./styles/Layouts";
import Navigation from "./components/Navigation";
import { useState } from "react";
import Profile from "./components/ProfilePage";
import Tool from "./components/Tool"
import HomePage from "./components/HomePage"

function App() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <HomePage />;

      case 2:
        return <Profile />;

      case 3:
        return <Tool />;

      // case 4:
      //   return <Travel />;

      default:
        return <HomePage />;
    }
  };

  return (
    // TODO: add bg
    <AppStyled className="App">
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
