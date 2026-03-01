import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const emptyDevice = {
  name: '',
  brand: '',
  model: '',
};

export default function DeviceFormDialog({ open, onClose, onSave, device, saving = false }) {
  const [form, setForm] = React.useState(emptyDevice);
  const isEdit = Boolean(device);

  React.useEffect(() => {
    if (device) {
      setForm({
        name: device.name || '',
        brand: device.brand || '',
        model: device.model || '',
      });
    } else {
      setForm(emptyDevice);
    }
  }, [device, open]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: form.name.trim(), brand: form.brand.trim(), model: form.model.trim() });
    // Parent closes dialog after updating state (so optimistic row can paint first)
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { component: 'form', onSubmit: handleSubmit },
      }}
    >
      <DialogTitle>{isEdit ? 'Edit Device' : 'Add Device'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            required
            label="Device Name"
            value={form.name}
            onChange={handleChange('name')}
            fullWidth
            placeholder="e.g. Living Room AC"
          />
          <TextField
            required
            label="Brand"
            value={form.brand}
            onChange={handleChange('brand')}
            fullWidth
            placeholder="e.g. Samsung"
          />
          <TextField
            required
            label="Model"
            value={form.model}
            onChange={handleChange('model')}
            fullWidth
            placeholder="e.g. WindFree 2.0"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Device'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeviceFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  device: PropTypes.object,
  saving: PropTypes.bool,
};
