import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={'outlined'}
      onClick={() => router.back()}
      startIcon={<ArrowBackIosIcon />}
    >
      Back
    </Button>
  );
};
