import { FC, useState, MouseEvent, ChangeEvent, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

interface TokenTwitterSentimentsDateRangeProp {
  onReset: () => void;
  onChange: (date: [string, string]) => void;
  defaultValues: [string, string] | undefined;
  isActive: boolean;
}

const TokenTwitterSentimentsDateRange: FC<
  TokenTwitterSentimentsDateRangeProp
> = ({ isActive, onChange, onReset, defaultValues }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [range, setRange] = useState({
    from: defaultValues ? defaultValues[0] : '',
    to: defaultValues ? defaultValues[1] : '',
  });
  const [toError, setToError] = useState(false);
  const isDisabledSubmit = !range.from || !range.to;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!isDisabledSubmit) {
      onChange([range.from, range.to]);
      handleClose();
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-range-popover' : undefined;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRange((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  useEffect(() => {
    if (range.to && range.from) {
      setToError(new Date(range.to) < new Date(range.from));
    }
  }, [range]);

  return (
    <>
      <Button
        aria-describedby={id}
        variant={isActive ? 'contained' : 'outlined'}
        onClick={handleClick}
      >
        Custom
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack component={'form'} width={280} p={2} pt={3} gap={2}>
          <Stack gap={3}>
            <FormControl>
              <TextField
                name="from"
                type={'datetime-local'}
                value={range.from}
                onChange={handleChange}
                sx={{
                  '.MuiInputAdornment-root': {
                    position: 'absolute',
                    pointerEvents: 'none',
                    right: 0,
                  },
                }}
                slotProps={{
                  htmlInput: { max: getCurrentDateTime() },
                  inputLabel: { shrink: true },
                  input: {
                    style: { position: 'relative' },
                    endAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                size="small"
                label="From:"
                fullWidth
                required
              />
            </FormControl>
            <FormControl error={toError}>
              <TextField
                name="to"
                type="datetime-local"
                value={range.to}
                error={toError}
                onChange={handleChange}
                sx={{
                  '.MuiInputAdornment-root': {
                    position: 'absolute',
                    pointerEvents: 'none',
                    right: 0,
                  },
                }}
                fullWidth
                slotProps={{
                  htmlInput: { min: range.from, max: getCurrentDateTime() },
                  inputLabel: { shrink: true },
                  input: {
                    style: { position: 'relative' },
                    endAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                label="To:"
                size="small"
                required
              />
              {toError ? (
                <FormHelperText>
                  Value must me {new Date(range.from).toLocaleString()} or later
                </FormHelperText>
              ) : null}
            </FormControl>
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Button
              variant={'text'}
              disabled={!isActive}
              onClick={onReset}
              size={'small'}
            >
              Reset
            </Button>
            <Stack direction={'row'} gap={1}>
              <Button variant={'text'} onClick={handleClose} size={'small'}>
                Close
              </Button>
              <Button
                variant={'contained'}
                disabled={isDisabledSubmit}
                onClick={handleSubmit}
                size={'small'}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

export default TokenTwitterSentimentsDateRange;
