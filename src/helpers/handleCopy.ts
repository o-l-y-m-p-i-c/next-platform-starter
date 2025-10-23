import { toast } from 'react-toastify';

export const handleCopy = async ({ text }: { text: string }) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied successfully');
  } catch (error) {
    const typedError = error as Error;
    toast.error(`Copy failed: ${typedError.message}`);
  }
};
