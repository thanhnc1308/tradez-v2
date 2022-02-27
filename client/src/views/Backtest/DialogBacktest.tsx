import { FC, useEffect, useState } from 'react';
import {
    Grid,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Autocomplete,
    Box
} from '@mui/material';
import PropTypes from 'prop-types';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { BacktestStrategies, StrategyType } from 'src/data/BacktestStrategies';

export type BacktestParamsType = {
    symbol?: string;
    dateRange?: DateRange<Date>;
    atrStopLoss?: number;
    atrScaleOut?: number;
    strategy?: StrategyType;
    strategyParams?: any;
};

type DialogBacktestProps = {
    onClose: Function;
    open: boolean;
};

const DialogBacktest: FC<DialogBacktestProps> = ({ onClose, open }) => {
    const [listSymbol, setListSymbol] = useState<string[]>([]);
    const [symbol, setSymbol] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange<Date>>([
        new Date('2021-02-01'),
        new Date('2021-07-04')
    ]);
    const [atrStopLoss, setAtrStopLoss] = useState<number>(1.5);
    const [atrScaleOut, setAtrScaleOut] = useState<number>(1);
    const [strategy, setStrategy] = useState<StrategyType>(null);
    const [strategyParams, setStrategyParams] = useState<any>({});

    useEffect(() => {
        setListSymbol(['HPG', 'DIG']);
    }, []);

    useEffect(() => {
        handleSelectStrategy();
    }, [strategy]);

    const handleSave = async () => {
        onClose('Yes', {
            symbol,
            dateRange,
            atrStopLoss,
            atrScaleOut,
            strategy,
            strategyParams
        });
    };

    const handleClose = (): void => {
        onClose('Cancel', null);
    };

    const handleSelectStrategy = (): void => {
        if (strategy) {
            switch (strategy.id) {
                case 'RSIStrategy':
                    setStrategyParams({
                        period: 14,
                        upper: 70,
                        lower: 30
                    });
                    break;
                case 'WilliamsRStrategy':
                    setStrategyParams({
                        period: 14,
                        upper: -20,
                        lower: -80
                    });
                    break;
                case 'RateOfChangeStrategy':
                    setStrategyParams({
                        period: 9
                    });
                    break;
                case 'EnvelopeStrategy':
                    setStrategyParams({
                        perc: 10
                    });
                    break;
                case 'UltimateOscillatorStrategy':
                    setStrategyParams({
                        p1: 7,
                        p2: 14,
                        p3: 28,
                        upper: 70,
                        lower: 30
                    });
                    break;
                case 'CCIStrategy':
                    setStrategyParams({
                        period: 14
                    });
                    break;
                case 'TrixStrategy':
                    setStrategyParams({
                        period: 18
                    });
                    break;
                case 'VortexStrategy':
                    setStrategyParams({
                        period: 14
                    });
                    break;
                case 'BollingerBandsAndRSIStrategy':
                    setStrategyParams({
                        bbband_period: 20,
                        devfactor: 2,
                        rsi_period: 14,
                        upper: 70,
                        lower: 30
                    });
                    break;
                case 'BollingerBandsSidewayStrategy':
                    setStrategyParams({
                        period: 20,
                        devfactor: 2
                    });
                    break;
                case 'BollingerBandsStrategy':
                    setStrategyParams({
                        period: 20,
                        devfactor: 2
                    });
                    break;
                case 'MACDStrategy':
                    setStrategyParams({
                        period_me1: 12,
                        period_me2: 26,
                        period_signal: 9
                    });
                    break;
                case 'MaCrossoverStrategy':
                    setStrategyParams({
                        pfast: 30,
                        pslow: 50
                    });
                    break;
                case 'ADXDMICrossStrategy':
                    setStrategyParams({
                        period: 14,
                        adx_strong_trend_level: 25
                    });
                    break;
                case 'PSARStrategy':
                    setStrategyParams({
                        period: 2,
                        af: 0.02,
                        afmax: 0.2
                    });
                    break;
                case 'AroonUpAndDownStrategy':
                    setStrategyParams({
                        period: 14
                    });
                    break;
            }
        }
    };

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Backtest</DialogTitle>
                <DialogContent>
                    <Grid sx={{ mt: { xs: 2, md: 0 } }} container spacing={2}>
                        <Grid item xs={4}>
                            <Autocomplete
                                disablePortal
                                id="symbol"
                                value={symbol}
                                onChange={(e, value: string) =>
                                    setSymbol(value)
                                }
                                options={listSymbol}
                                renderInput={(params) => (
                                    <TextField {...params} label="Symbol" />
                                )}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                    startText="Start date"
                                    endText="End date"
                                    value={dateRange}
                                    onChange={(newValue) => {
                                        setDateRange(newValue);
                                    }}
                                    renderInput={(startProps, endProps) => (
                                        <>
                                            <TextField {...startProps} />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField {...endProps} />
                                        </>
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                value={atrStopLoss}
                                onChange={(e) =>
                                    setAtrStopLoss(+e.target.value)
                                }
                                label="ATR Stop Loss"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                value={atrScaleOut}
                                onChange={(e) =>
                                    setAtrScaleOut(+e.target.value)
                                }
                                label="ATR Scale Out"
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                value={strategy}
                                onChange={(e, value) =>
                                    setStrategy(value as StrategyType)
                                }
                                getOptionLabel={(option) => option.label}
                                options={BacktestStrategies}
                                renderInput={(params) => (
                                    <TextField {...params} label="Strategy" />
                                )}
                            />
                        </Grid>
                        {!!strategy && strategy.id === 'RSIStrategy' && (
                            <>
                                <Grid item xs={4}>
                                    <TextField
                                        value={strategyParams.period}
                                        onChange={(e) =>
                                            setStrategyParams({
                                                ...strategyParams,
                                                period: +e.target.value
                                            })
                                        }
                                        label="Period"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        value={strategyParams.upper}
                                        onChange={(e) =>
                                            setStrategyParams({
                                                ...strategyParams,
                                                upper: +e.target.value
                                            })
                                        }
                                        label="Upper"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        value={strategyParams.lower}
                                        onChange={(e) =>
                                            setStrategyParams({
                                                ...strategyParams,
                                                lower: +e.target.value
                                            })
                                        }
                                        label="Lower"
                                        type="number"
                                    />
                                </Grid>
                            </>
                        )}
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

DialogBacktest.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default DialogBacktest;
