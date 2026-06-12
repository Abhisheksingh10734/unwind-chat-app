import { Home } from './pages/Home';
import { Otp } from './pages/Otp';
import { Signup } from './pages/Signup';
import { UserChat } from './pages/UserChat';

export const App = () => {

  return (
    <div className='w-full h-screen bg-[#1E1B2E] text-white'>

      {/* <Signup /> */}

      <Otp />

      {/* <Home /> */}

      {/* <UserChat /> */}

    </div>
  );
};