export type StrategyType = {
    id?: string;
    label?: string;
    description?: string;
}

export const BacktestStrategies: StrategyType[] = [
    {
        id: 'RSIStrategy',
        label: 'RSI Strategy',
        description:
            'RSI Strategy will execute a buy transaction when RSI goes oversold and a sell transaction when RSI goes overbought'
    },
    // {
    //   id: "BollingerBandsAndRSIStrategy",
    //   label: "Bollinger Bands And RSI Strategy",
    //   description: "Bollinger Bands And RSI Strategy",
    // },
    // {
    //   id: "BollingerBandsSidewayStrategy",
    //   label: "Bollinger Bands Sideway Strategy",
    //   description: "Bollinger Bands Sideway Strategy",
    // },
    {
        id: 'BollingerBandsStrategy',
        label: 'Bollinger Bands Strategy',
        description:
            'Bollinger Bands Strategy will execute a buy transaction when price closes below the bottom band and a sell transaction when price close above the top band'
    },
    {
        id: 'MACDStrategy',
        label: 'MACD Strategy',
        description:
            'MACD Strategy will execute a buy transaction when histogram goes from negative to positive and a sell transaction when histogram goes from positive to negative'
    },
    {
        id: 'MaCrossoverStrategy',
        label: 'Moving Average Crossover Strategy',
        description:
            'Moving Average Crossover Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA'
    },
    {
        id: 'ADXDMICrossStrategy',
        label: 'ADX-DMI Cross Strategy',
        description:
            'ADX-DMI Cross Strategy will execute a buy transaction when DMI+ goes above DMI- and a sell transaction when DMI+ goes below DMI- and both with ADX is above strong trend level'
    },
    {
        id: 'PSARStrategy',
        label: 'Parabolic SAR Strategy',
        description:
            'Parabolic SAR Strategy will execute a buy transaction when the PSAR dot goes below price and a sell transaction when the PSAR dot goes above price'
    },
    {
        id: 'AroonUpAndDownStrategy',
        label: 'Aroon Up And Down Strategy',
        description:
            'Aroon Up And Down Strategy will execute a buy transaction when Aroon Up goes above Aroon Down and a sell transaction when Aroon Up goes below Aroon Down'
    },
    {
        id: 'CCIStrategy',
        label: 'Commodity Channel Index Strategy'
        // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    },
    {
        id: 'TrixStrategy',
        label: 'Trix Strategy',
        description:
            'Trix Strategy will execute a buy transaction when TRIX goes above zero line and a sell transaction when TRIX goes below zero line'
    },
    {
        id: 'VortexStrategy',
        label: 'Vortex Strategy',
        description:
            'Vortex Strategy will execute a buy transaction when VI+ crosses above VI- and a sell transaction when VI+ crosses below VI-'
    },
    {
        id: 'UltimateOscillatorStrategy',
        label: 'Ultimate Oscillator Strategy',
        description:
            'Ultimate Oscillator Strategy will execute a buy transaction when Ultimate Oscillator goes oversold and a sell transaction when Ultimate Oscillator goes overbought'
    },
    {
        id: 'EnvelopeStrategy',
        label: 'Envelope Strategy',
        description:
            'Envelope Strategy will execute a buy transaction when he price moved below the lower range and a sell transaction when when the price moved beyond the upper range'
    },
    {
        id: 'RateOfChangeStrategy',
        label: 'Rate Of Change Strategy',
        description:
            'Rate Of Change Strategy will execute a buy transaction when Rate Of Change goes above zero line and a sell transaction when Rate Of Change goes below zero line'
    },
    {
        id: 'WilliamsRStrategy',
        label: 'Williams %R Strategy',
        description:
            'Williams %R Strategy will execute a buy transaction when Williams %R goes oversold and a sell transaction when Williams %R goes overbought'
    }
    //#endregion DONE
    // {
    //   id: "AccelerationDecelerationOscillatorStrategy",
    //   label: "Acceleration Deceleration Oscillator",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "AwesomeOscillatorStrategy",
    //   label: "Awesome Oscillator Strategy",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "IchimokuStrategy",
    //   label: "Ichimoku Strategy",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "RelativeMomentumIndexStrategy",
    //   label: "Relative Momentum Index Strategy",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "StochasticStrategy",
    //   label: "Stochastic Strategy",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "TrueStrengthIndicatorStrategy",
    //   label: "True Strength Indicator Strategy",
    //   // description: "Commodity Channel Index Strategy will execute a buy transaction when fast EMA goes above slow EMA and a sell transaction when fast EMA goes below slow EMA",
    // },
    // {
    //   id: "JapaneseCandlestickStrategy",
    //   label: "Japanese Candlestick Strategy",
    //   description: "Japanese Candlestick will execute a buy transaction when price formed a bullish pin bar/engufling/maruboru and a sell transaction when formed a bearish pin bar/engufling/maruboru",
    // },
];
