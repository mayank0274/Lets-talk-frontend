import React, { useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
  Image,
  Box,
  AbsoluteCenter,
  Text,
} from "@chakra-ui/react";

export const PreviewMedia = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { type, url, setPreviewMedia } = props;
  const preview = useRef();

  useEffect(() => {
    preview.current.click();
  }, []);

  return (
    // component for previewing media used by MediaMessage component
    <>
      <button onClick={onOpen} style={{ display: "none" }} ref={preview}>
        open
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setPreviewMedia(false);
        }}
      >
        <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)">
          <ModalCloseButton color="white" size="lg" />
          <AbsoluteCenter>
            {type == "image" ? (
              <Box boxSize="sm">
                <Image src={url} alt="preview_media" />
              </Box>
            ) : type == "video" ? (
              <Box
                as="video"
                controls
                src={url}
                alt="preview_media"
                objectFit="contain"
                sx={{
                  aspectRatio: "16/9",
                }}
              />
            ) : (
              <Text color="#fff">
                Preview not available download file to view it.
              </Text>
            )}
          </AbsoluteCenter>
        </ModalOverlay>
      </Modal>
    </>
  );
};
