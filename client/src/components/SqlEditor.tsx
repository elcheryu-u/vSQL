import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import React, { useState } from 'react';
import ResultsTable from './ResultsTable';
import { Box, Button, Typography } from '@u_ui/u-ui';
import CircularProgress from '@u_ui/u-ui/CircularProgress';

const SqlEditor: React.FC = () => {
    const [sql, setSql] = useState('SELECT * FROM your_table;');
    interface QueryResult {
        data?: Record<string, unknown>[];
        [key: string]: unknown;
    }

    const [result, setResult] = useState<QueryResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunQuery = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://localhost:5000/query', { sql });
            setResult(response.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='h6'>Editor SQL</Typography>

            <Editor 
                height="200px"
                defaultLanguage='sql'
                value={sql}
                theme='vs-dark'
                onChange={(value) => setSql(value || '')}
            />

            <Button
                variant="contained"
                color="primary"
                onClick={handleRunQuery}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Ejecutar'}
            </Button>

            {error && (
                <p>{error}</p>
            )}

            {result?.data && Array.isArray(result.data) && (
                <ResultsTable data={result.data} />
            )}
        </Box>
    )
}

export default SqlEditor;