export type TRSSNews = {
  id: string;
  messageTitle: string;
  url: string;
  imageLink: string;
  message: string;
  messageTime: Date;
  source: {
    title: string;
    iconURL: string;
  };
};
