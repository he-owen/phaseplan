import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../../auth/LogoutButton';
import {
  fetchRateProviders,
  setUserProvider,
  generateMonthlyRates,
  saveUserPreferences,
} from '../../api';

const STEPS = ['Enter your zip code', 'Select your utility provider', 'Set your preferences'];

const DEFAULT_DAY = { homeStart: '17:00', homeEnd: '08:00', awakeStart: '06:00', awakeEnd: '23:00' };
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

function buildDefaultSchedule() {
  const s = {};
  DAYS.forEach((d) => { s[d] = { ...DEFAULT_DAY }; });
  return s;
}

export default function OnboardingDialog({ open, onComplete }) {
  const { getAccessTokenSilently } = useAuth0();

  const [step, setStep] = React.useState(0);
  const [zipCode, setZipCode] = React.useState('');
  const [providers, setProviders] = React.useState([]);
  const [selectedProvider, setSelectedProvider] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [schedule, setSchedule] = React.useState(buildDefaultSchedule);
  const [tempAwake, setTempAwake] = React.useState(72);
  const [tempSleeping, setTempSleeping] = React.useState(68);

  const updateDay = (day, field, value) => {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const copyToAll = (sourceDay) => {
    setSchedule((prev) => {
      const src = prev[sourceDay];
      const next = {};
      DAYS.forEach((d) => { next[d] = { ...src }; });
      return next;
    });
  };

  const handleFetchProviders = async () => {
    if (!zipCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const list = await fetchRateProviders(token, zipCode.trim());
      if (list.length === 0) {
        setError('No utility providers found for this zip code. Try another.');
        return;
      }
      setProviders(list);
      setSelectedProvider(list[0].id);
      setStep(1);
    } catch (e) {
      setError(e?.message ?? 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderNext = () => {
    if (!selectedProvider) return;
    setStep(2);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await setUserProvider(token, selectedProvider);
      const now = new Date();
      try {
        await generateMonthlyRates(token, selectedProvider, now.getMonth() + 1, now.getFullYear());
      } catch (rateErr) {
        // Rate generation can fail (e.g. provider not found); still complete setup
        console.warn('Rate generation skipped:', rateErr?.message);
      }
      await saveUserPreferences(token, {
        weeklySchedule: schedule,
        tempAwake: Number(tempAwake),
        tempSleeping: Number(tempSleeping),
      });
      onComplete();
    } catch (e) {
      setError(e?.message ?? 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    else if (step === 1) { setStep(0); setProviders([]); setSelectedProvider(''); }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      onClose={(_, reason) => { if (reason === 'backdropClick') return; }}
    >
      <DialogTitle>Welcome! Let's set up your account</DialogTitle>
      <DialogContent>
        <Stepper activeStep={step} sx={{ mt: 1, mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>
        )}

        {step === 0 && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Enter your home zip code so we can find available utility providers and rate plans in your area.
            </Typography>
            <TextField
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 19805"
              fullWidth
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleFetchProviders(); }}
            />
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              We found {providers.length} rate plan(s) for zip code {zipCode}. Select the one that matches your utility bill.
            </Typography>
            <TextField
              select
              label="Utility Provider / Rate Plan"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              fullWidth
            >
              {providers.map((p, i) => (
                <MenuItem key={p.id ?? `provider-${i}`} value={p.id}>{p.utilityName} — {p.rateName}</MenuItem>
              ))}
            </TextField>
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Set your weekly schedule and temperature preferences so we can optimize your energy usage.
            </Typography>

            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Day</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Home from</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Home to</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Awake from</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Awake to</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DAYS.map((day) => (
                    <TableRow key={day}>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', px: 0.5, py: 0.5 }}>
                        {DAY_LABELS[day]}
                      </TableCell>
                      {['homeStart', 'homeEnd', 'awakeStart', 'awakeEnd'].map((field) => (
                        <TableCell key={field} align="center" sx={{ px: 0.5, py: 0.5 }}>
                          <TextField
                            type="time"
                            size="small"
                            value={schedule[day][field]}
                            onChange={(e) => updateDay(day, field, e.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                      ))}
                      <TableCell sx={{ px: 0.5, py: 0.5 }}>
                        <Tooltip title="Copy this day to all days">
                          <IconButton size="small" onClick={() => copyToAll(day)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Preferred temp when awake"
                type="number"
                value={tempAwake}
                onChange={(e) => setTempAwake(e.target.value)}
                fullWidth
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">°F</InputAdornment> },
                }}
                inputProps={{ min: 55, max: 85, step: 1 }}
              />
              <TextField
                label="Preferred temp when sleeping"
                type="number"
                value={tempSleeping}
                onChange={(e) => setTempSleeping(e.target.value)}
                fullWidth
                slotProps={{
                  input: { endAdornment: <InputAdornment position="end">°F</InputAdornment> },
                }}
                inputProps={{ min: 55, max: 85, step: 1 }}
              />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <LogoutButton size="small" color="inherit" sx={{ mr: 1 }} />
        {step > 0 && (
          <Button onClick={handleBack} disabled={loading}>Back</Button>
        )}
        <Box sx={{ flex: 1 }} />
        {step === 0 && (
          <Button
            variant="contained"
            onClick={handleFetchProviders}
            disabled={loading || !zipCode.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            Find Providers
          </Button>
        )}
        {step === 1 && (
          <Button variant="contained" onClick={handleProviderNext} disabled={!selectedProvider}>
            Next
          </Button>
        )}
        {step === 2 && (
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            Confirm & Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
