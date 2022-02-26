import { FC, useEffect, useState } from 'react';
import {
    Grid,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    OutlinedInput,
    InputLabel,
    Select,
    Autocomplete
} from '@mui/material';
import journal from 'src/models/journal';
import { DatePicker } from '@mui/lab';
import { JournalAPI } from 'src/apis/JournalAPI';
import { FormState } from 'src/models/common';
import PropTypes from 'prop-types';

type DialogJournalProps = {
    state: FormState;
    onClose: Function;
    open: boolean;
    currentItem: journal;
    setCurrentItem: Function;
};

const DialogJournal: FC<DialogJournalProps> = ({
    state,
    onClose,
    open,
    currentItem,
    setCurrentItem
}) => {
    const isViewing = state === 'View';
    const [listSymbol, setListSymbol] = useState<string[]>([]);

    useEffect(() => {
        setListSymbol(['HPG', 'DIG']);
    }, []);

    const handleSave = async () => {
        let result: any = null;
        const item: journal = {
            ...currentItem,
            user_id: 'user_id'
        };
        if (state === 'Add') {
            result = await JournalAPI.post(item);
        } else if (state === 'Edit') {
            result = await JournalAPI.put(item);
        }
        close();
    };

    const handleClose = (): void => {
        close();
    };

    const close = (): void => {
        onClose(currentItem);
    };

    const handleChangeEntry = (e): void => {
        const entry = +e.target.value;
        setCurrentItem({
            ...currentItem,
            entry,
            pnl: calculatePnL(entry, currentItem.exit)
        });
    };

    const handleChangeExit = (e): void => {
        const exit = +e.target.value;
        setCurrentItem({
            ...currentItem,
            exit,
            pnl: calculatePnL(currentItem.entry, exit)
        });
    };

    const calculatePnL = (entry: number = 1, exit: number = 0): number => {
        if (entry === 0) {
            return 0;
        }
        return Math.round(((exit - entry) / entry) * 100);
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Journal</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <DatePicker
                                    label="Transaction Date"
                                    disabled={isViewing}
                                    value={currentItem.transaction_date}
                                    onChange={(newValue) => {
                                        setCurrentItem({
                                            ...currentItem,
                                            transaction_date: newValue
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Autocomplete
                                    disablePortal
                                    id="symbol"
                                    disabled={isViewing}
                                    value={currentItem.symbol}
                                    onChange={(e, value: string) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            symbol: value
                                        })
                                    }
                                    options={listSymbol}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Symbol" />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="transaction_type-label">
                                    Transaction Type
                                </InputLabel>
                                <Select
                                    labelId="transaction_type"
                                    id="transaction_type"
                                    value={currentItem.transaction_type}
                                    disabled={isViewing}
                                    onChange={(e) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            transaction_type: e.target.value
                                        })
                                    }
                                    input={
                                        <OutlinedInput label="Transaction Type" />
                                    }
                                >
                                    <MenuItem value={'Buy'}>Buy</MenuItem>
                                    <MenuItem value={'Sell'}>Sell</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <TextField
                                    id="entry"
                                    value={currentItem.entry}
                                    disabled={isViewing}
                                    onChange={handleChangeEntry}
                                    label="Entry"
                                    type="number"
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <TextField
                                    id="exit"
                                    value={currentItem.exit}
                                    disabled={isViewing}
                                    onChange={handleChangeExit}
                                    label="Exit"
                                    type="number"
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <label id="transaction_type-label">PnL</label>
                                <span>{currentItem.pnl}</span>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                sx={{ m: 1, minWidth: 120, width: '100%' }}
                            >
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="comments"
                                    label="Comments"
                                    disabled={isViewing}
                                    value={currentItem.comments}
                                    onChange={(e) =>
                                        setCurrentItem({
                                            ...currentItem,
                                            comments: e.target.value
                                        })
                                    }
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={isViewing} onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

DialogJournal.propTypes = {
    // state: PropTypes.elementType.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    currentItem: PropTypes.instanceOf(journal).isRequired,
    setCurrentItem: PropTypes.func.isRequired
};

export default DialogJournal;
