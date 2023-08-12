import React from "react";
import {
  Card,
  CardBody,
  Image,
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

import FILEIMAGE from "../assets/file.png";
import PLAYBUTTON from "../assets/play_btn.jpg";
import { PreviewMedia } from "./PreviewMedia";
import { useState } from "react";

export const MediaMessage = (props) => {
  const { isUpoadingMedia, background, sender, url, time, size, type } = props;
  const [previewMedia, setPreviewMedia] = useState(false);

  let downloadableURL;
  if (url != null) {
    const modifiedUrl = url.split("upload/");
    downloadableURL = `${modifiedUrl[0]}upload/fl_attachment/${modifiedUrl[1]}`;
  }
  const alignmentStyle = {
    ...(sender && { marginLeft: "auto" }),
    ...(!sender && { marginRight: "auto" }),
  };

  return (
    // component for message if it is some file => used SingleMessage component
    <>
      <Card
        direction="row"
        overflow="hidden"
        bg={background ? background : "#D34515"}
        w={{ md: "100%", lg: "30%" }}
        minH={100}
        color="#fff"
        sx={alignmentStyle}
        my="10px"
        padding={0}
      >
        <Box h="100%" w="50%">
          <Image
            src={
              type == "image"
                ? url
                  ? url
                  : FILEIMAGE
                : type == "video"
                ? PLAYBUTTON
                : FILEIMAGE
            }
            alt="default_file"
            onClick={() => {
              setPreviewMedia(true);
            }}
            cursor="pointer"
            w="100%"
            h="100%"
          />
        </Box>

        {previewMedia && (
          <PreviewMedia
            type={type}
            url={url}
            setPreviewMedia={setPreviewMedia}
          />
        )}
        <HStack w="50%">
          <CardBody>
            <Flex direction="column" h="100%">
              <Heading size="md">{type}</Heading>
              <Heading size="sm" my="5px">
                {size != null ? `${Math.ceil(size / 1024 / 1024)} mb` : ""}
              </Heading>

              {isUpoadingMedia ? (
                <Spinner />
              ) : (
                <Link href={downloadableURL}>
                  <i
                    className="fa-regular fa-circle-down fa-2x"
                    style={{ color: "#fff" }}
                  ></i>
                </Link>
              )}

              <Text fontSize="10px" color="gray.100" alignSelf="flex-end">
                {time}
              </Text>
            </Flex>
          </CardBody>
        </HStack>
      </Card>
    </>
  );
};
