import { MainPage } from "./pages/MainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as navigatorConstants from './utils/navigator-constants';
import { LoginPage } from './pages/LoginPage';
import { QuizPage } from "./pages/QuizPage";
import { SigunupPage } from "./pages/SignupPage";
import { FormAddQuizPage } from "./pages/FormAddQuizPage";
import { FormEditQuizPage } from "./pages/FormEditQuizPage";
import { HostPage } from "./pages/HostPage";
import { PlayQuizPage } from "./pages/PlayQuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={navigatorConstants.MainPage} element={<MainPage />}></Route>
        <Route path={navigatorConstants.Login} element={<LoginPage />}></Route>
        <Route path={navigatorConstants.QuizPage} element={<QuizPage />}></Route>
        <Route path={navigatorConstants.SignUp} element={<SigunupPage />}></Route>
        <Route path={navigatorConstants.FormQuizPage}>
          <Route index element={<FormAddQuizPage />}/>
          <Route path={":" + navigatorConstants.QuizIdParam} element={<FormEditQuizPage />}/>
        </Route>
        <Route path={navigatorConstants.HostPage}>
          <Route path={":" + navigatorConstants.RoomIdParam} element={<HostPage />}/>
        </Route>
        <Route path={navigatorConstants.PlayQuizPage}>
          <Route path={":" + navigatorConstants.RoomIdParam} element={<PlayQuizPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
