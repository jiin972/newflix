import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Movie from "./Routes/Movie";
import TvShow from "./Routes/TvShow";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 200px;
  min-height: 100vh;
`;
const ContentWrapper = styled.div`
  flex-grow: 1;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Movie />}>
              <Route path="movies/:id" element={<Movie />} />
            </Route>
            <Route path="/tv" element={<TvShow />}>
              <Route path=":id" element={<TvShow />} />
            </Route>
            <Route path="/search" element={<Search />}>
              <Route path="movies/:id" element={<Search />} />
              <Route path="tv/:id" element={<Search />} />
            </Route>
          </Routes>
        </ContentWrapper>

        <Footer />
      </AppContainer>
    </Router>
  );
}

export default App;
