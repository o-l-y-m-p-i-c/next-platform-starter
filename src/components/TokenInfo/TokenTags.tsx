import { FC } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { TToken } from '@/types/responces/Token';
import { Link } from '@mui/material';
import r from '@/constants/routes.constants';

const TokenTags: FC<Pick<TToken, 'tags'>> = ({ tags }) => {
  if (!tags.length) {
    return null;
  }

  return (
    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
      {tags.map((tag) => (
        <Link key={tag.name} href={`${r.tags}/${tag.slug}`}>
          <Chip label={tag.name} size="small" variant="outlined" />
        </Link>
      ))}
    </Stack>
  );
};

export default TokenTags;
