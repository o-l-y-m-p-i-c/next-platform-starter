import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const STORAGE_KEY = 'chatPersonId';

const useChatPerson = (): { from: string; connected: boolean } => {
  const { address, isConnected } = useAccount();

  const [from, setFrom] = useState<string>('');
  const userId = uuidv4();

  useEffect(() => {
    const storedId: string | null = localStorage.getItem(STORAGE_KEY);

    if (!address && !storedId) {
      // if there's no address and no stored ID, generate a new one
      const newId: string = userId;
      setFrom(newId);
      localStorage.setItem(STORAGE_KEY, newId);
    } else if (!address && storedId) {
      // if there's no address but there's a stored ID, use it
      setFrom(storedId);
    } else if (address) {
      // if there's an address, use it
      setFrom(address.toString());

      // migrate userId to address
      if (storedId && storedId !== address.toString()) {
        localStorage.setItem(STORAGE_KEY, address.toString());
      }
    }
  }, [address]);

  return { from, connected: isConnected };
};

export default useChatPerson;
