import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth0 } from '@auth0/auth0-react';
import {
  getUserProfile,
  getUserPreferences,
  saveUserPreferences,
} from '../../api';
import Copyright from '../internals/components/Copyright';

const DEFAULT_DAY = { homeStart: '17:00', homeEnd: '08:00', awakeStart: '06:00', awakeEnd: '23:00' };
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

function buildDefaultSchedule() {
  const s = {};
  DAYS.forEach((d) => { s[d] = { ...DEFAULT_DAY }; });
  return s;
}

export default function PreferencesPage() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const [profileInfo, setProfileInfo] = React.useState(null);

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

  React.useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const [profile, prefs] = await Promise.all([
          getUserProfile(token),
          getUserPreferences(token),
        ]);
        if (cancelled) return;
        setProfileInfo(profile);
        if (prefs) {
          if (prefs.weeklySchedule) {
            const loaded = prefs.weeklySchedule;
            const merged = buildDefaultSchedule();
            DAYS.forEach((d) => {
              if (loaded[d]) merged[d] = { ...merged[d], ...loaded[d] };
            });
            setSchedule(merged);
          }
          setTempAwake(prefs.tempAwake);
          setTempSleeping(prefs.tempSleeping);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message ?? 'Failed to load preferences');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getAccessTokenSilently();
      await saveUserPreferences(token, {
        weeklySchedule: schedule,
        tempAwake: Number(tempAwake),
        tempSleeping: Number(tempSleeping),
      });
      setSuccess('Preferences saved successfully.');
    } catch (e) {
      setError(e?.message ?? 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Preferences
      </Typography>

      {profileInfo && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Account Info
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Chip label={`Email: ${profileInfo.email}`} variant="outlined" />
              {profileInfo.zip && (
                <Chip label={`Zip Code: ${profileInfo.zip}`} variant="outlined" />
              )}
              {profileInfo.selectedProviderId && (
                <Chip label="Utility provider configured" color="success" variant="outlined" />
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Weekly Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set when you are typically home and awake for each day of the week. Click the copy icon to apply one day's schedule to all days.
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>
          )}
          {success && (
            <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>
          )}

          <Box sx={{ overflowX: 'auto', mb: 3 }}>
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
                          value={schedule[day]?.[field] ?? ''}
                          onChange={(e) => updateDay(day, field, e.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          sx={{ width: 130 }}
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Thermostat preferences
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : undefined}
            >
              Save Preferences
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
