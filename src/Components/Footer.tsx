import styled from "styled-components";

const FooterBox = styled.div`
  width: 100%;
  margin-top: 80px;
  padding: 40px 0;
  background-color: black;
`;
const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
`;

function Footer() {
  return (
    <>
      <FooterBox>
        <Box>
          <span>©Copyright 2025. Seongjin All right reserved.</span>
        </Box>
      </FooterBox>
    </>
  );
}

export default Footer;
