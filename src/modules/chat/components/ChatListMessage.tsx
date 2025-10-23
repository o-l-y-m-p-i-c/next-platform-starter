import { identicon } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import type { TChatMessage } from '../../../types/responces/Chat';

import styles from './ChatList.module.css';
import { Box } from '@mui/system';
import { ImageWithFallback } from '../../../components/ImageWithFallback';

const ChatMessage = ({ me, from, message, createdAt }: TChatMessage & { me: string }) => {
    const messageClass = from === me ? 'sent' : 'received';
    const avatar = createAvatar(identicon, { seed: from });

    return (
        <div className={`${styles.message} ${styles[messageClass]}`} style={{ gap: 10 }}>
            <ImageWithFallback
                src={avatar.toDataUri()}
                containerstyleprops={{
                    width: 20,
                    minWidht: 20,
                    height: 20,
                    // marginRight: 10,
                    marginTop: 2
                }}
                style={{
                    objectFit: 'cover'
                }}
                alt={'User'}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: messageClass === 'sent' ? 'flex-end' : 'flex-start',
                    gap: 1,
                    flex: 1
                }}
            >
                {messageClass === 'sent' && (
                    <span
                        style={{
                            height: 24,
                            fontSize: 10,
                            display: 'flex',
                            marginTop: 'auto',
                            alignItems: 'center'
                        }}
                    >
                        {new Intl.DateTimeFormat('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }).format(new Date(createdAt))}
                    </span>
                )}
                <p>{message}</p>
                {messageClass === 'received' && (
                    <span
                        style={{
                            height: 24,
                            fontSize: 10,
                            display: 'flex',
                            marginTop: 'auto',
                            alignItems: 'center'
                        }}
                    >
                        {new Intl.DateTimeFormat('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }).format(new Date(createdAt))}
                    </span>
                )}
            </Box>
        </div>
    );
};

export default ChatMessage;
