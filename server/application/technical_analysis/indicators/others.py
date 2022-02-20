import numpy as np
import pandas as pd

from application.technical_analysis.indicators.utils import IndicatorMixin


class DailyReturnIndicator(IndicatorMixin):
    """Daily Return (DR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.
    """

    def __init__(self, close: pd.Series, fillna: bool = False):
        self._close = close
        self._fillna = fillna
        self._run()

    def _run(self):
        self._dr = (
            self._close / self._close.shift(1, fill_value=self._close.mean())
        ) - 1
        self._dr *= 100

    def daily_return(self) -> pd.Series:
        """Daily Return (DR)

        Returns:
            pandas.Series: New feature generated.
        """
        dr_series = self._check_fillna(self._dr, value=0)
        return pd.Series(dr_series, name="daily_return")


class DailyLogReturnIndicator(IndicatorMixin):
    """Daily Log Return (DLR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.
    """

    def __init__(self, close: pd.Series, fillna: bool = False):
        self._close = close
        self._fillna = fillna
        self._run()

    def _run(self):
        self._dr = pd.Series(np.log(self._close)).diff()
        self._dr *= 100

    def daily_log_return(self) -> pd.Series:
        """Daily Log Return (DLR)

        Returns:
            pandas.Series: New feature generated.
        """
        dr_series = self._check_fillna(self._dr, value=0)
        return pd.Series(dr_series, name="daily_log_return")


class CumulativeReturnIndicator(IndicatorMixin):
    """Cumulative Return (CR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.
    """

    def __init__(self, close: pd.Series, fillna: bool = False):
        self._close = close
        self._fillna = fillna
        self._run()

    def _run(self):
        self._cr = (self._close / self._close.iloc[0]) - 1
        self._cr *= 100

    def cumulative_return(self) -> pd.Series:
        """Cumulative Return (CR)

        Returns:
            pandas.Series: New feature generated.
        """
        cum_ret = self._check_fillna(self._cr, value=-1)
        return pd.Series(cum_ret, name="cumulative_return")


def daily_return(close, fillna=False):
    """Daily Return (DR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.

    Returns:
        pandas.Series: New feature generated.
    """
    return DailyReturnIndicator(close=close, fillna=fillna).daily_return()


def daily_log_return(close, fillna=False):
    """Daily Log Return (DLR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.

    Returns:
        pandas.Series: New feature generated.
    """
    return DailyLogReturnIndicator(close=close, fillna=fillna).daily_log_return()


def cumulative_return(close, fillna=False):
    """Cumulative Return (CR)

    Args:
        close(pandas.Series): dataset 'Close' column.
        fillna(bool): if True, fill nan values.

    Returns:
        pandas.Series: New feature generated.
    """
    return CumulativeReturnIndicator(close=close, fillna=fillna).cumulative_return()
