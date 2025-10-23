import { Typography, Box } from '@mui/material';

const PageNotFound = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h3" align="center">
        Page not found
      </Typography>
      <Typography variant="h6" align="center">
        Try to go to the main page or use search
      </Typography>
    </Box>
  );
};

export { PageNotFound };
