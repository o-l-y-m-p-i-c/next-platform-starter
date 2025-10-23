import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useActionState,
  useMemo,
} from 'react';
import { SocketContext } from '../../../context';
import { SendIcon } from '../../../assets/SendIcon';
import ChatListMessage from './ChatListMessage';
import styles from './ChatList.module.css';
import { removeDuplicatesByKey } from '../../../utils/removeDuplicatesByKey';
import type { TChatMessage } from '../../../types/responces/Chat';
import useChatPerson from '../hooks/useChatPerson';
import { groupBy } from '../../../helpers/groupBy';
import InfiniteScroll from 'react-infinite-scroll-component';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import { Stack } from '@mui/system';
import { useAuth } from '../../../hooks';
import { useAccount } from 'wagmi';
import { AuthButton } from '../../../components/AuthButton';

type TForm = {
  message: string;
};

interface ChatProp {
  tokenSlug?: string;
  tokenName?: string;
}

type GroupedData = Record<string, TChatMessage[]>;

const cleanStringFromSpace = (string: string) => {
  return string.trimStart().trimEnd();
};

const Chat: FC<ChatProp> = ({ tokenSlug, tokenName }) => {
  const { user } = useAuth();
  const { isConnected } = useAccount();

  const isAuth = user && isConnected;

  const socket = useContext(SocketContext);
  const [chatMessages, setChatMessages] = useState<TChatMessage[]>([]);
  const [isLoadingMainMessages, setIsLoadingMainMessages] = useState(true);
  const [isFinal, setFinalFlag] = useState(false);
  const { from } = useChatPerson();

  const isLoading = useRef(false);

  const [state, formAction, isPending] = useActionState<TForm, FormData>(
    async (_previousState: TForm, payload: FormData) => {
      const dirty = payload.get('message') as string;
      const message = cleanStringFromSpace(dirty);

      if (!message) {
        return { message: '' };
      }

      try {
        await socket?.emitWithAck('chat:sendMessage', {
          tokenSlug,
          message,
          from,
        });

        return { message: '' };
      } catch (error) {
        console.error(error);
        return { message };
      }
    },
    { message: '' },
  );

  useEffect(() => {
    if (!socket) return;

    const event = tokenSlug
      ? `chat:newMessages:${tokenSlug}`
      : 'chat:newMessages';

    const handleNewMessages = (messages: TChatMessage[]) => {
      setChatMessages((prevMessages) =>
        removeDuplicatesByKey<TChatMessage>(
          [messages, prevMessages],
          'externalId',
        ).slice(0, 100),
      );
      setIsLoadingMainMessages(false);
    };

    setTimeout(() => {
      // Because for chats that have no messages, the load state will not be invoked
      setIsLoadingMainMessages(false);
      // Internet connection speed...
    }, 3000);

    socket.on(event, handleNewMessages);
    socket.emit('subscribe', event);

    return () => {
      socket.off(event, handleNewMessages);
      socket.emit('unsubscribe', event);
    };
  }, [socket, tokenSlug]);

  const groupedData: GroupedData = useMemo(
    () =>
      groupBy(chatMessages, ({ createdAt }: { createdAt: Date }) =>
        new Intl.DateTimeFormat('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(createdAt)),
      ),
    [chatMessages],
  );

  const today = new Date();
  const formattedToday = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedYesterday = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(yesterday);

  const renderDate = ({ date }: { date: string }): string => {
    return date === formattedToday
      ? 'Today'
      : date === formattedYesterday
        ? 'Yesterday'
        : date.includes(today.getFullYear().toString())
          ? date.replace(`.${today.getFullYear()}`, '')
          : date;
  };

  const fetch = async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const latestTimeStamp = chatMessages[chatMessages.length - 1].createdAt;

      if (!socket) throw new Error('Socket not available');
      if (!latestTimeStamp)
        throw new Error('Could not find the latest time stamp');

      let response = null;
      if (tokenSlug) {
        response = await socket.emitWithAck('chat:prevMessages', {
          from: latestTimeStamp,
          slug: tokenSlug,
        });
      } else {
        response = await socket.emitWithAck('chat:prevMessages', {
          from: latestTimeStamp,
        });
      }
      if (response && response.data) {
        setChatMessages((prevMessages) => [...prevMessages, ...response.data]);
        setFinalFlag(response.isFinal);
      } else {
        throw new Error('Invalid response');
      }
      console.log('response sol', response);
    } catch (error) {
      const typedError = error as Error;
      console.error(typedError.message);
    }

    isLoading.current = false;
  };

  return (
    <div className={styles.chat} style={{ flex: 1 }}>
      <div className={styles.chat_body}>
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          {!isLoadingMainMessages ? (
            chatMessages.length > 0 && groupedData ? (
              <>
                <ScrollingContainer
                  items={chatMessages}
                  content={groupedData}
                  fetch={fetch}
                  isFinal={isFinal}
                  from={from}
                  renderDate={renderDate}
                />
              </>
            ) : (
              <div className={styles.messagesEmpty}>
                {tokenName
                  ? `No messages for ${tokenName}. Be the first!`
                  : `No messages. Be the first!`}
              </div>
            )
          ) : (
            <Stack alignItems={'center'} justifyContent={'center'} flex={1}>
              <CircularProgress />
            </Stack>
          )}
        </div>

        {isAuth ? (
          <form className={styles.form} action={formAction}>
            <div className={styles.messages_input_wrapper}>
              <input
                type="text"
                name="message"
                className={styles.messages_input}
                defaultValue={state.message}
                // placeholder={connected ? 'Authorized message' : 'Message'}
                placeholder={'Your message'}
                disabled={isPending}
                maxLength={120}
              />
            </div>
            <Button
              className={styles.messages_submit}
              type="submit"
              size="small"
              disabled={isPending}
            >
              {isPending ? (
                <CircularProgress color={'inherit'} size={'xs'} />
              ) : (
                <SendIcon />
              )}
            </Button>
          </form>
        ) : (
          <Stack mt={2}>
            <AuthButton btnLabel={'Please sign in to send messages'} />
          </Stack>
        )}
      </div>
    </div>
  );
};

function ScrollingContainer({
  items,
  fetch,
  from,
  renderDate,
  content,
  isFinal,
}: {
  items: TChatMessage[];
  fetch: () => void;

  from: string;
  renderDate: ({ date }: { date: string }) => string;
  content: GroupedData;
  isFinal: boolean;
}) {
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (innerRef?.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  }, [innerRef]);

  const handleScrollDown = () => {
    if (!innerRef?.current) return;
    innerRef.current.scrollTo(0, innerRef.current.scrollHeight);
  };

  const handleOnScroll = () => {
    if (!innerRef?.current) return;
    if (innerRef.current.scrollTop < -150) {
      // show icon
      setShowScrollDownButton(true);
    } else {
      // hide icon
      setShowScrollDownButton(false);
    }
  };

  return (
    <>
      {showScrollDownButton && (
        <IconButton
          onClick={handleScrollDown}
          aria-label="fingerprint"
          color="primary"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 15,
            zIndex: 100,
          }}
          size="small"
        >
          <ArrowCircleDownIcon fontSize="large" />
        </IconButton>
      )}
      <Box
        id="scrollableDiv"
        onScroll={handleOnScroll}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          paddingRight: 1,
          overscrollBehavior: 'contain',
          display: 'flex',
          flexDirection: 'column-reverse',
          scrollBehavior: 'smooth',
        }}
        ref={innerRef}
      >
        <InfiniteScroll
          dataLength={items.length}
          next={fetch}
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 10,
          }}
          inverse={true}
          hasMore={!isFinal}
          loader={
            <Stack alignItems={'center'} justifyContent={'center'} height={50}>
              <CircularProgress
                size={'small'}
                sx={{
                  minWidth: 30,
                  height: 30,
                }}
              />
            </Stack>
          }
          scrollableTarget="scrollableDiv"
        >
          {Object.keys(content).map((date: string, i: number) => {
            return (
              <div
                key={`${date}-${i}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <p
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    maxWidth: '100%',
                    fontSize: 12,
                  }}
                >
                  {renderDate({ date })}
                </p>
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {content[date]
                    .map((message: TChatMessage) => (
                      <ChatListMessage
                        key={message?.externalId}
                        me={from}
                        {...message}
                      />
                    ))
                    .reverse()}
                </ul>
              </div>
            );
          })}
          {isFinal && (
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              pt={1}
              pb={1}
            >
              <Typography textAlign={'center'} variant="caption">
                All messages have been loaded
              </Typography>
            </Stack>
          )}
        </InfiniteScroll>
      </Box>
    </>
  );
}

export default Chat;
