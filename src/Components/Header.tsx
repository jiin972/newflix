import styled from "styled-components";
import { Link, useMatch, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useScroll,
  type Variants,
} from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const NavBar = styled(motion.nav)`
  position: fixed;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  font-size: 15px;
  z-index: 1;
`;
const NavColumn = styled.div`
  display: flex;
  align-items: center;
  &:last-child {
    margin-right: 20px;
  }
`;
const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  margin-right: 50px;
  fill: ${(props) => props.theme.red};
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  position: relative;
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Dot = styled(motion.div)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.red};
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Search = styled.form`
  margin-right: 20px;
  display: flex;
  align-items: center;
  position: relative;
  color: white;
  svg {
    height: 25px;
    z-index: 10;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0px;
  background-color: transparent;
  padding: 5px 10px;
  padding-left: 30px;
  color: white;
  font-size: 16px;
  border: 1px solid ${(props) => props.theme.white.lighter};
  &::placeholder {
    color: ${(props) => props.theme.white.darker};
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const UserBtn = styled.button<{ $userOpen: boolean }>`
  background-image: url("https://play-lh.googleusercontent.com/EwN12x-sr1KVCpHYyG4kFE2NMH5ZdXStj5e5eHAFfyxNTcXRoUs4DxyJyvkBeeqY76k");
  background-size: cover;
  border: 1px solid ${(props) => props.theme.white.darker};
  width: 35px;
  height: 35px;
  border-radius: 25%;
  cursor: pointer;
  position: relative;
`;

const Arrow = styled(motion.span)`
  color: ${(props) => props.theme.white.lighter};
`;

const UserMenu = styled(motion.ul)`
  background-color: ${(props) => props.theme.black.darker};
  width: 200px;
  height: 300px;
  border-radius: 1%;
  border: 1px solid white;
  color: ${(props) => props.theme.white.lighter};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 30px;
  position: absolute;
  top: 120%;
  right: 0;
`;

const UserAvatar = styled.div`
  background-image: url("https://play-lh.googleusercontent.com/EwN12x-sr1KVCpHYyG4kFE2NMH5ZdXStj5e5eHAFfyxNTcXRoUs4DxyJyvkBeeqY76k");
  background-size: cover;
  border: 1px solid ${(props) => props.theme.white.darker};
  border-radius: 25%;
  width: 75px;
  height: 75px;
  margin-bottom: 20px;
`;
const UserProfile = styled.li``;
const UserAcount = styled.li``;
const UserHelp = styled.li``;

//Variants

const navVariants: Variants = {
  up: { backgroundColor: "rgba(0,0,0,0)" },
  scroll: { backgroundColor: "rgba(0,0,0,1)" },
};

const logoVariant: Variants = {
  normal: {
    opacity: 1,
    fillOpacity: 1,
  },
  hover: {
    opacity: 1,
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      ease: "easeInOut",
      duration: 2,
      repeatType: "reverse",
    },
  },
};

const userMenuVariants: Variants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

//interface
interface IForm {
  keyword: string;
}

function Header() {
  const navigate = useNavigate(); // 검색 입력 후 search.tsx이동 기능
  const homeMatch = useMatch("/");
  const tvMatch = useMatch("/tv");
  const [searchOpen, setSearchOpen] = useState(false); //search part
  const [userOpen, setUserOpen] = useState(false); // userBtn part
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useScroll(); // scroll변화 감지
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({ scaleX: 0 });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latestValue) => {
      console.log("scrollY값:", latestValue);
      if (latestValue > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("up");
      }
    });
    return () => unsubscribe();
  }, [navAnimation, scrollY]);
  //userBtn부분
  const toggleUser = () => {
    setUserOpen((prev) => !prev);
    console.log("status:", `${userOpen ? "open" : "closed"}`);
  };
  // 검색로직
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ keyword }: IForm) => {
    navigate(`/search?keyword=${keyword}`);
    setValue("keyword", "");
    inputAnimation.start({ scaleX: 0 });
    setSearchOpen(false);
  };

  return (
    <NavBar variants={navVariants} initial="up" animate={navAnimation}>
      <NavColumn>
        <Logo
          variants={logoVariant}
          initial="normal"
          whileHover={"hover"}
          xmlns="http://www.w3.org/2000/svg"
          width="400"
          height="107.78"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
        </Logo>
        <Items>
          <Item>
            <Link to="/">Home</Link>
            {homeMatch && <Dot key="home-dot" />}
          </Item>

          <Item>
            <Link to="/tv">Tv Shows</Link>
            {tvMatch && <Dot key="tv-dot" />}
          </Item>
        </Items>
      </NavColumn>
      <NavColumn>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -230 : 0 }}
            transition={{ type: "tween" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></motion.path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }} //초기상태 정의
            transition={{ type: "tween" }}
            placeholder="Search a movie or tv show.."
          />
        </Search>
        <UserArea>
          <UserBtn onClick={toggleUser} $userOpen={userOpen}>
            <AnimatePresence>
              {userOpen && (
                <UserMenu
                  key={"user-dropdown"}
                  variants={userMenuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <UserAvatar />
                  <hr style={{ borderColor: "white", width: "100%" }} />
                  <UserProfile>프로필</UserProfile>
                  <UserAcount>계정</UserAcount>
                  <UserHelp>고객센터</UserHelp>
                </UserMenu>
              )}
            </AnimatePresence>
          </UserBtn>

          <Arrow>{userOpen ? "▲" : "▼"}</Arrow>
        </UserArea>
      </NavColumn>
    </NavBar>
  );
}

export default Header;
