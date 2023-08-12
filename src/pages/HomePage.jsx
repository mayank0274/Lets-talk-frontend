import React from "react";
import { Signup } from "../components/Signup";
import { Login } from "../components/Login";
import BackgroundImage from "../assets/background.jpg";
import {
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const bgImageStyle = {
  background: `url(${BackgroundImage})`,
  width: "60%",
  height: "100vh",
  backgroundSize: "cover",
};

export const HomePage = () => {
  // uses login & signup components
  return (
    <Flex w="100%" minHeight="100vh" alignItems="center" justify="center">
      <Flex
        w={{ xl: "50%", lg: "65%", sm: "100vw", md: "100vw" }}
        bg="#0f0f0f"
        alignItems="center"
        justifyContent="center"
        direction="column"
        color="#fff"
        minHeight="100vh"
      >
        <Heading as="h4" p="10px" textAlign="center">
          Login / Signup to use
          <span
            style={{
              color: "#fe8040",
              textAlign: "center",
              paddingLeft: "9px",
            }}
          >
            Let's Talk
          </span>
        </Heading>
        <Tabs variant="soft-rounded" colorScheme="orange" mt="20px" w="75%">
          <TabList w="85%">
            <Tab w="50%" color="#fff">
              Login
            </Tab>
            <Tab w="50%" color="#fff">
              Signup
            </Tab>
          </TabList>
          <TabPanels w="85%">
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <section style={bgImageStyle} className="homePageBg"></section>
    </Flex>
  );
};
