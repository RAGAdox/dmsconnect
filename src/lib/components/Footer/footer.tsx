import { Box, Text } from "@radix-ui/themes";
// import "./footer.scss";
const footer = () => {
  return (
    <footer className="footer">
      <Box
        p="2"
        style={{
          background: "var(--accent-9)",
          color: "var(--accent-contrast)",
        }}
      >
        <Text size="1" as="p" align="right">
          Powered by Department of Management Studies
        </Text>
        <Text size="1" as="p" align="right">
          Sikkim Manipal Institute of Technology, Majitar, Sikkim
        </Text>
      </Box>
    </footer>
  );
};

export default footer;
