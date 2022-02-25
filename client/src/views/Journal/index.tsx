import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { FC, useEffect, useRef, useState } from 'react';
import {
    Grid,
    Container,
    Button,
    Divider,
    Box,
    Card,
    Typography,
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
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import BulkActions from './BulkActions';
import BaseTable from 'src/components/BaseTable';
import TableStore from 'src/common/TableStore';
import { columnsJournal } from 'src/common/columnConfigs';
import journal from 'src/models/journal';
import stock from 'src/models/stock';
import { DatePicker } from '@mui/lab';
import { JournalAPI } from 'src/apis/JournalAPI';
import { FormState } from 'src/models/common';

const store = new TableStore<journal>({
    proxy: {
        url: '/journals',
        type: 'remote'
    }
});

// item selected to create/edit/delete
const defaultItem = new journal({
    symbol: null,
    transaction_type: 'Sell',
    transaction_date: new Date(),
    entry: 0,
    exit: 0,
    pnl: 0,
    screenshot: null,
    comments: null
});

const Journal: FC = () => {
    const user = {
        name: 'thanhnc',
        avatar: '/static/images/avatars/1.jpg'
    };
    let state: FormState = 'View';
    // multiple items selected in table
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentItem, setCurrentItem] = useState<journal>(defaultItem);
    const showBulkActions = selectedItems.length > 0;
    const [open, setOpen] = useState(false);
    const [listSymbol, setListSymbol] = useState<string[]>([]);

    useEffect(() => {
        setListSymbol(['HPG', 'DIG']);
    }, []);

    // #region Dialog Journal
    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleSave = async () => {
        let result: any = null;
        const item: journal = {
            ...currentItem,
            user_id: 'user_id'
        };
        debugger;
        if (state === 'Create') {
            result = await JournalAPI.post(item);
        } else if (state === 'Update') {
            result = await JournalAPI.put(item);
        }
        close();
    };

    const handleClose = (): void => {
        close();
    };

    const close = (): void => {
        setOpen(false);
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
    }
    // #endregion Dialog Journal

    return (
        <>
            <Helmet>
                <title>Journal</title>
            </Helmet>
            <PageTitleWrapper>
                <Grid
                    id={new Date().getTime().toString()}
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Journals
                        </Typography>
                        <Typography variant="subtitle2">
                            {user.name}, these are your recent journals
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            onClick={handleClickOpen}
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                            Create journal
                        </Button>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Card>
                            <Card>
                                {showBulkActions && (
                                    <Box flex={1} p={2}>
                                        <BulkActions />
                                    </Box>
                                )}
                                <Divider />
                                <BaseTable
                                    store={store}
                                    columns={columnsJournal}
                                />
                            </Card>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Journal</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <DatePicker
                                    label="Transaction Date"
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
                                    onChange={handleChangeExit}
                                    label="Exit"
                                    type="number"
                                    variant="standard"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <label id="transaction_type-label">
                                    PnL
                                </label>
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
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Journal;
