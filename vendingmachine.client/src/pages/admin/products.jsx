import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, Container, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { BrandDropdown } from '../../components/brandDropdown';

const AdminProducts = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productsData, setProductsData] = useState([]);
    const [error, setError] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [jsonData, setJsonData] = useState({});

    const handleBrandChange = (brandName) => {
        setSelectedOption(brandName);
        setJsonData((prevData) => ({
            ...prevData,
            brandName: brandName // Обновил на правильное поле
        }));
    };

    const handleProductNameInputChange = (event) => {
        setJsonData((prevData) => ({
            ...prevData,
            name: event.target.value,
        }));
    };

    const handleProductPriceInputChange = (event) => {
        setJsonData((prevData) => ({
            ...prevData,
            price: event.target.value,
        }));
    };

    const columns = [
        { field: 'id', headerName: '#', width: 70 },
        { field: 'name', headerName: 'Название', width: 130 },
        { field: 'price', headerName: 'Цена', width: 130 },
        { field: 'brand', headerName: 'Бренд', width: 130 }
    ];
    const paginationModel = { page: 0, pageSize: 5 };

    const productsRequest = async () => {
        setDataLoading(true);
        try {
            const response = await fetch('/products/get-products/');
            if (response.ok) {
                const productsResponse = await response.json();
                setProductsData(productsResponse);
            }
        } catch (error) {
            setError(error);
        } finally {
            setDataLoading(false);
        }
    };

    // Вызываем productsRequest при первом рендере
    useEffect(() => {
        productsRequest();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/products/add-products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // После успешного добавления, обновите список товаров
            await productsRequest();
            setJsonData({}); // Сбросить jsonData
            setSubmitResult({ success: true, message: 'Товар успешно добавлен!' });
        } catch (error) {
            console.error('Error:', error);
            setSubmitResult({ success: false, message: 'Ошибка при добавлении товара.' });
        } finally {
            setLoading(false);
            // Таймаут для скрытия сообщения
            setTimeout(() => setSubmitResult(null), 3000);
        }
    };

    return (
        <Container>
            <Box display="flex" justifyContent="center" alignItems="flex-start" height="100vh">
                <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
                    <Typography variant="h5" component="h2" style={{ marginBottom: '16px' }}>
                        Товары
                    </Typography>
                    <Link to="/admin/main" style={{ textDecoration: 'none' }}>
                        <Button sx={{ mb: 10 }} variant="contained" color="secondary">Назад</Button>
                    </Link>

                    {dataLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {productsData && productsData.length > 0 ? (
                                <DataGrid
                                    rows={productsData}
                                    columns={columns}
                                    initialState={{ pagination: { paginationModel } }}
                                    pageSize={10}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    pagination
                                    checkboxSelection
                                    sx={{ border: 0, mb: 3 }}
                                />
                            ) : (
                                <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 10 }}>
                                    Нет доступных товаров.
                                </Typography>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                                <TextField
                                    name="name"
                                    label="Название"
                                    variant="outlined"
                                    fullWidth
                                    value={jsonData.name || productName}
                                    onChange={handleProductNameInputChange}
                                    required
                                    sx={{ mr: 2, mb: 2 }}
                                    disabled={loading}
                                />
                                <BrandDropdown onChange={handleBrandChange} />
                                <TextField
                                    type="number"
                                    name="productPrice"
                                    label="Цена"
                                    variant="outlined"
                                    fullWidth
                                    value={jsonData.price || productPrice}
                                    onChange={handleProductPriceInputChange}
                                    required
                                    sx={{ mr: 2 }}
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: '16px' }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Добавить'}
                                </Button>
                            </form>

                            {submitResult && (
                                <Box sx={{ mt: 2 }}>
                                    <Alert severity={submitResult.success ? 'success' : 'error'}>
                                        {submitResult.message}
                                    </Alert>
                                </Box>
                            )}
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export { AdminProducts };
