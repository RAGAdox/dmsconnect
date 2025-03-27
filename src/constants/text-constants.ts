const TEXT_CONSTANTS = {
  index: {
    title: "DMS Connect",
    description: "Enhancing life at SMIT",
  },
  flagModule: {
    file: {
      title: "File Sharing",
      description: "Allows file sharing",
      link: "/file-share",
      feature: {
        file_upload: {
          form: {
            title: "Upload Course Materials",
            description:
              "This module allows students to upload course materials",
          },
        },
      },
    },
  },
} as const;

export default TEXT_CONSTANTS;
