import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Copyright from '../internals/components/Copyright';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const initialHistory = [
  { id: '1', month: 1, year: 2025, totalAmount: 127.40, usageKwh: 842, utility: 'Local Electric Co' },
  { id: '2', month: 12, year: 2024, totalAmount: 118.20, usageKwh: 785, utility: 'Local Electric Co' },
  { id: '3', month: 11, year: 2024, totalAmount: 142.80, usageKwh: 920, utility: 'Local Electric Co' },
  { id: '4', month: 10, year: 2024, totalAmount: 98.50, usageKwh: 652, utility: 'Local Electric Co' },
  { id: '5', month: 9, year: 2024, totalAmount: 135.00, usageKwh: 891, utility: 'Local Electric Co' },
];

function a11yProps(index) {
  return {
    id: `billing-tab-${index}`,
    'aria-controls': `billing-tabpanel-${index}`,
  };
}

const emptyForm = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  totalAmount: '',
  usageKwh: '',
  utility: '',
  notes: '',
};

export default function BillingPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [history, setHistory] = React.useState(initialHistory);
  const [form, setForm] = React.useState(emptyForm);
  const [uploadPreview, setUploadPreview] = React.useState(null);
  const [uploadFile, setUploadFile] = React.useState(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setTab(0);
    setForm(emptyForm);
    setUploadPreview(null);
    setUploadFile(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setUploadPreview(null);
    setUploadFile(null);
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setUploadPreview(null);
    setUploadFile(null);
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitManual = (e) => {
    e.preventDefault();
    const newBill = {
      id: crypto.randomUUID(),
      month: Number(form.month),
      year: Number(form.year),
      totalAmount: parseFloat(form.totalAmount) || 0,
      usageKwh: parseInt(form.usageKwh, 10) || 0,
      utility: form.utility || '—',
    };
    setHistory((prev) => [newBill, ...prev]);
    setForm(emptyForm);
    handleCloseDialog();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddFromUpload = () => {
    if (!uploadFile) return;
    const newBill = {
      id: crypto.randomUUID(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      totalAmount: null,
      usageKwh: null,
      utility: 'From upload',
    };
    setHistory((prev) => [newBill, ...prev]);
    handleCloseDialog();
  };

  const handleDeleteBill = (id) => {
    setHistory((prev) => prev.filter((b) => b.id !== id));
  };

  const formatMonthYear = (month, year) => `${MONTHS[month - 1]} ${year}`;

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1200px' } }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography component="h2" variant="h6">
          Billing & Utility Bills
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={handleOpenDialog}
        >
          Add bill
        </Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Usage (kWh)</TableCell>
              <TableCell>Utility</TableCell>
              <TableCell align="right" padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{formatMonthYear(row.month, row.year)}</TableCell>
                <TableCell align="right">
                  {row.totalAmount != null ? `$${row.totalAmount.toFixed(2)}` : '—'}
                </TableCell>
                <TableCell align="right">
                  {row.usageKwh != null ? row.usageKwh : '—'}
                </TableCell>
                <TableCell>{row.utility}</TableCell>
                <TableCell align="right" padding="none">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteBill(row.id)}
                    aria-label="Delete"
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add utility bill</DialogTitle>
        <Tabs value={tab} onChange={handleTabChange} aria-label="Add bill method" sx={{ px: 2 }}>
          <Tab label="Enter manually" {...a11yProps(0)} />
          <Tab label="Upload image" {...a11yProps(1)} />
        </Tabs>
        <DialogContent>
          {tab === 0 && (
            <Box component="form" id="bill-form" onSubmit={handleSubmitManual}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    fullWidth
                    label="Month"
                    value={form.month}
                    onChange={handleFormChange('month')}
                  >
                    {MONTHS.map((m, i) => (
                      <MenuItem key={m} value={i + 1}>{m}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    label="Year"
                    value={form.year}
                    onChange={handleFormChange('year')}
                    inputProps={{ min: 2020, max: 2030 }}
                    sx={{ width: 120 }}
                  />
                </Stack>
                <TextField
                  type="number"
                  label="Total amount ($)"
                  value={form.totalAmount}
                  onChange={handleFormChange('totalAmount')}
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="e.g. 127.40"
                />
                <TextField
                  type="number"
                  label="Usage (kWh)"
                  value={form.usageKwh}
                  onChange={handleFormChange('usageKwh')}
                  inputProps={{ min: 0 }}
                  placeholder="e.g. 842"
                />
                <TextField
                  label="Utility company"
                  value={form.utility}
                  onChange={handleFormChange('utility')}
                  placeholder="e.g. Local Electric Co"
                />
                <TextField
                  label="Notes (optional)"
                  value={form.notes}
                  onChange={handleFormChange('notes')}
                  multiline
                  rows={2}
                  placeholder="Meter reading, plan name, etc."
                />
              </Stack>
            </Box>
          )}
          {tab === 1 && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('bill-file-input').click()}
              >
                <input
                  id="bill-file-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                {uploadPreview ? (
                  <Stack alignItems="center" spacing={1}>
                    <Box
                      component="img"
                      src={uploadPreview}
                      alt="Bill preview"
                      sx={{ maxHeight: 180, maxWidth: '100%', borderRadius: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {uploadFile?.name}
                    </Typography>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadPreview(null);
                        setUploadFile(null);
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                ) : (
                  <>
                    <AddPhotoAlternateRoundedIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Drag and drop or click to browse
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PNG, JPG
                    </Typography>
                  </>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Bill data can be extracted later. This saves the entry to your history.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {tab === 0 ? (
            <Button type="submit" form="bill-form" variant="contained">
              Add to history
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={!uploadFile}
              onClick={handleAddFromUpload}
            >
              Save to history
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
