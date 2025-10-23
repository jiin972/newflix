import styled from "styled-components";

const FooterBox = styled.div`
  width: 100%;
  margin-top: 180px;
  padding: 50px 0;
  background-color: black;
`;
const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8vw;
`;

function Footer() {
  return (
    <>
      <FooterBox>
        <Box>
          <span>© Copyright 2025 Seongjin All right reserved</span>
        </Box>
      </FooterBox>
    </>
  );
}

export default Footer;
