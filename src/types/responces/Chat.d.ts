export type TChatMessage = {
  externalId: string;
  message: string;
  from: string;
  tokenSlug?: string;
  createdAt: Date;
};

// not used
// export type TChatMessageSend = {
//   message: string;
//   from: string;
//   tokenSlug?: string;
// };
