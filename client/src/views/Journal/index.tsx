import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { FC, useEffect, useState } from 'react';
import {
    Grid,
    Container,
    Button,
    Divider,
    Box,
    Card,
    Typography
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import BaseTable from 'src/components/BaseTable';
import TableStore from 'src/common/TableStore';
import { columnsJournal } from 'src/common/columnConfigs';
import journal from 'src/models/journal';
import { JournalAPI } from 'src/apis/JournalAPI';
import { FormState } from 'src/models/common';
import DialogJournal from './DialogJournal';

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
    comments: `some comment ${new Date().getTime()}`
});

const Journal: FC = () => {
    const user = {
        name: 'thanhnc',
        avatar: '/static/images/avatars/1.jpg'
    };
    const [state, setState] = useState<FormState>('View');
    // multiple items selected in table
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [currentItem, setCurrentItem] = useState<journal>(defaultItem);
    const [open, setOpen] = useState(false);

    const handleClickAdd = (): void => {
        setCurrentItem(defaultItem);
        setState('Add');
        handleClickOpen();
    };

    const handleClickEdit = (item): void => {
        setCurrentItem(item);
        setState('Edit');
        handleClickOpen();
    };

    const handleClickView = (item: journal): void => {
        setCurrentItem(item);
        setState('View');
        handleClickOpen();
    };

    const handleClickDelete = async (item: journal): Promise<any> => {
        try {
            const res = await JournalAPI.delete(item);
            if (res) {
                alert('Success');
            } else {
                alert('Failure');
            }
        } catch (e) {
            alert(e);
        }
    };

    const handleDoubleClick = (item: journal): void => {
        handleClickView(item);
    };

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const onClose = (item): void => {
        setOpen(false);
    };

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
                            onClick={handleClickAdd}
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
                                <BaseTable
                                    store={store}
                                    columns={columnsJournal}
                                    hasActionEdit={true}
                                    hasActionView={true}
                                    hasActionDelete={true}
                                    onClickEdit={handleClickEdit}
                                    onClickDelete={handleClickDelete}
                                    onClickView={handleClickView}
                                    onDoubleClick={handleDoubleClick}
                                />
                            </Card>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
            <DialogJournal
                state={state}
                open={open}
                onClose={onClose}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
            />
        </>
    );
};

export default Journal;
