import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import { FC, useEffect, useState } from 'react';
import { Grid, Container, Card, Box, Button, Typography } from '@mui/material';
import BaseTable from 'src/components/BaseTable';
import { columnsBacktestResult } from 'src/common/columnConfigs';
import { BacktestAPI } from 'src/apis/BacktestAPI';
import { formatDate, toThousandFilter } from 'src/common/format';
import { styled } from '@mui/material/styles';
import DialogBacktest, { BacktestParamsType } from './DialogBacktest';
import { DialogActionType } from 'src/models/common';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const Wrapper = styled(Box)(
    ({ theme }) => `
        padding: ${theme.spacing(4, 0)};
    `
);

type BacktestResultType = {
    data?: any[];
    symbol?: string;
    title?: string;
    totalTrades?: number;
    totalWon?: number;
    totalLosses?: number;
    winRate?: number;
};

const Backtest: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [hasData, setHasData] = useState<boolean>(false);
    const [backtestResults, setBacktestResults] = useState<
        BacktestResultType[]
    >([]);
    const [open, setOpen] = useState<boolean>(false);
    let backtestParams: BacktestParamsType = {};

    const showParametersForm = (): void => {
        setOpen(true);
    };

    const onClose = (
        action: DialogActionType,
        item: BacktestParamsType
    ): void => {
        setOpen(false);
        if (action === 'Yes') {
            backtestParams = item;
            showResult();
        }
    };

    const showResult = async () => {
        setLoading(true);
        setHasData(false);
        const formatDate = (date) => {
                if (date && date instanceof Date) {
                    return (
                        date.getUTCFullYear() +
                        '/' +
                        (date.getUTCMonth() + 1) +
                        '/' +
                        date.getUTCDate()
                    );
                } else {
                    return '';
                }
            },
            fromDate = formatDate(backtestParams.dateRange[0]),
            toDate = formatDate(backtestParams.dateRange[1]);
        if (backtestParams.symbol && backtestParams.strategy) {
            const url = '',
                payload = {
                    symbol: backtestParams.symbol,
                    from_date: fromDate,
                    to_date: toDate,
                    strategy: backtestParams.strategy,
                    strategy_params: backtestParams.strategyParams
                },
                res = await BacktestAPI.request({
                    url,
                    method: 'post',
                    payload
                });
            if (res && res.success) {
                const results = prepareResults(res.data);
                setHasData(true);
            }
        }
        setLoading(false);
    };

    const prepareResults = (data) => {
        const results = [];
        for (const item of data) {
            const result = {
                ...item
            };
            result.title = buildBacktestTitle(item);
            result.data = prepareDisplayData(item.result);
            results.push(result);
        }
        return results;
    };

    const buildBacktestTitle = (item) => {
        const fromDate = formatDate(backtestParams.dateRange[0]),
            toDate = formatDate(backtestParams.dateRange[1]);
        return `Backtest result for ${backtestParams.strategy.label} of ${item.symbol} symbol from ${fromDate} to ${toDate}`;
    };

    const prepareDisplayData = (data) => {
        return (data || []).map((item) => {
            return {
                transaction_date: formatDate(item.transaction_date),
                transaction_type: item.transaction_type,
                description: getDescription(item),
                style: getRowStyle(item)
            };
        });
    };

    const getRowStyle = (row) => {
        switch (row.transaction_type) {
            case 'SCALE OUT CREATE':
                return 'color: green;';
            case 'STOP LOSS CREATE':
                return 'color: red;';
        }
    };

    const getDescription = (item) => {
        let result = '';
        switch (item.transaction_type) {
            case 'BUY CREATE':
            case 'SELL CREATE':
                result = `Price close at ${toThousandFilter(
                    item.price
                )}. ATR stop loss level is ${toThousandFilter(
                    Math.round(item.stop_loss_level)
                )}. ATR scale out level is ${toThousandFilter(
                    Math.round(item.scale_out_level)
                )}.`;
                break;
            case 'SCALE OUT CREATE':
            case 'STOP LOSS CREATE':
                result = `Price close at ${toThousandFilter(item.price)}`;
                break;
            case 'BUY EXECUTED':
                result = `Buy executed at ${toThousandFilter(
                    item.price
                )} with cost ${toThousandFilter(
                    item.cost
                )} and commission ${toThousandFilter(item.commission)}`;
                break;
            case 'SELL EXECUTED':
                result = `Sell executed at ${toThousandFilter(
                    item.price
                )} with cost ${toThousandFilter(
                    item.cost
                )} and commission ${toThousandFilter(item.commission)}`;
                break;
            case 'OPERATION PROFIT':
                const net = toThousandFilter(item.net),
                    gross = toThousandFilter(item.gross);
                if (item.net >= 0) {
                    result = `Gross profit is ${gross} and net profit is ${net}`;
                } else {
                    result = `Gross loss is ${gross} and net loss is ${net}`;
                }
                break;
        }
        return result;
    };

    return (
        <>
            <Helmet>
                <title>Backtest</title>
            </Helmet>
            <PageTitleWrapper>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            Backtest
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            onClick={showParametersForm}
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                        >
                            Choose backtest parameters
                        </Button>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Wrapper>
                <Container maxWidth="lg">
                    {hasData && backtestResults.length > 0 && (
                        <>
                            {backtestResults.map((result) => {
                                return (
                                    <div
                                        key={result.symbol}
                                        className="result-item"
                                    >
                                        <div className="title text-center bold mb-1">
                                            {result.title}
                                        </div>
                                        <div className="title text-center italic mb-1">
                                            Total trades:
                                            {result.totalTrades}
                                        </div>
                                        <div className="title text-center italic mb-1">
                                            Total wins: {result.totalWon || 0}
                                        </div>
                                        <div className="title text-center italic mb-1">
                                            Total losses:{' '}
                                            {result.totalLosses || 0}
                                        </div>
                                        <div className="title text-center italic mb-1">
                                            Win rate: {result.winRate || 0}%
                                        </div>
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
                                                            columns={
                                                                columnsBacktestResult
                                                            }
                                                            data={result.data}
                                                        />
                                                    </Card>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </Container>
            </Wrapper>
            <Footer />
            <DialogBacktest open={open} onClose={onClose} />
        </>
    );
};

export default Backtest;
