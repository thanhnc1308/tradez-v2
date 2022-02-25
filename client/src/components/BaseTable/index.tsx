import { ChangeEvent, FC, useEffect, useState } from 'react';
import TableStore from 'src/common/TableStore';
import BaseModel from 'src/models/BaseModel';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
    Tooltip,
    Box,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Typography,
    useTheme
} from '@mui/material';
import { ColumnType } from 'src/common/columnConfigs';

interface BaseTableProps {
    multiple?: boolean;
    columns: ColumnType[];
    store: TableStore<BaseModel>;
}

const BaseTable: FC<BaseTableProps> = ({ columns, store, multiple = true }) => {
    const theme = useTheme();
    // const [items, setItems] = useState<BaseModel[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [paginatedItems, setPaginatedItems] = useState<BaseModel[]>([]);
    const isSelectedSomeItems =
        selectedItems.length > 0 &&
        selectedItems.length < paginatedItems.length;
    const isSelectedAllItems =
        selectedItems.length === paginatedItems.length &&
        paginatedItems.length > 0;

    useEffect(() => {
        const load = async () => {
            const options = {
                page: page,
                per_page: limit,
                method: 'get'
            };
            await store.load(options);
            setPaginatedItems(store.data);
            setTotal(store.total);
        };
        load();
    }, [page, limit, store]);

    const handleSelectAllItem = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedItems(
            event.target.checked ? paginatedItems.map((item) => item.id) : []
        );
    };

    const handleSelectOneItem = (
        event: ChangeEvent<HTMLInputElement>,
        itemId: string
    ): void => {
        if (!selectedItems.includes(itemId)) {
            setSelectedItems((prevSelected) => [...prevSelected, itemId]);
        } else {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((id) => id !== itemId)
            );
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {multiple && (
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isSelectedAllItems}
                                        indeterminate={isSelectedSomeItems}
                                        onChange={handleSelectAllItem}
                                    />
                                </TableCell>
                            )}
                            {columns.map((column) => {
                                return (
                                    <TableCell
                                        key={column.key}
                                        align={column.columnAlign || 'center'}
                                    >
                                        {column.label}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedItems.map((item) => {
                            const isSelected = selectedItems.includes(item.id);
                            return (
                                <TableRow
                                    hover
                                    key={item.id}
                                    selected={isSelected}
                                >
                                    {multiple && (
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isSelected}
                                                onChange={(
                                                    event: ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    handleSelectOneItem(
                                                        event,
                                                        item.id
                                                    )
                                                }
                                                value={isSelected}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => {
                                        return (
                                            <TableCell
                                                key={`{${column.key}_${item.id}`}
                                                align={
                                                    column.dataAlign ||
                                                    column.columnAlign ||
                                                    'center'
                                                }
                                            >
                                                <Typography>
                                                    {item[column.key]}
                                                </Typography>
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell align="right">
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background:
                                                            theme.colors.primary
                                                                .lighter
                                                    },
                                                    color: theme.palette.primary
                                                        .main
                                                }}
                                                color="inherit"
                                                size="small"
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background:
                                                            theme.colors.error
                                                                .lighter
                                                    },
                                                    color: theme.palette.error
                                                        .main
                                                }}
                                                color="inherit"
                                                size="small"
                                            >
                                                <DeleteTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {total > 0 && (
                <Box p={2}>
                    <TablePagination
                        component="div"
                        count={total}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleLimitChange}
                        page={page}
                        rowsPerPage={limit}
                        rowsPerPageOptions={[5, 10, 25, 30]}
                    />
                </Box>
            )}
        </>
    );
};

export default BaseTable;
