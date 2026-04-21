import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { FEEDBACK_RECEIVED_ACKNOWLEDGEMENT } from '../constants/feedbackMessages';

/**
 * Shown after public feedback is submitted successfully.
 * Displays the standard County acknowledgement in a clear, focused layout.
 */
const FeedbackSubmittedDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    aria-labelledby="feedback-submitted-title"
    aria-describedby="feedback-submitted-body"
    PaperProps={{
      sx: { borderRadius: 2, overflow: 'hidden' }
    }}
  >
    <Box
      sx={{
        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
        color: 'common.white',
        px: 3,
        py: 2.5,
        textAlign: 'center'
      }}
    >
      <CheckCircle sx={{ fontSize: 52, mb: 1, opacity: 0.95 }} />
      <Typography id="feedback-submitted-title" variant="h5" fontWeight="bold" component="h2">
        Your message has been received
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.95 }}>
        Thank you for contacting the County Government of Kisumu
      </Typography>
    </Box>
    <DialogContent sx={{ pt: 3, pb: 1 }}>
      <Paper
        id="feedback-submitted-body"
        elevation={0}
        sx={{
          p: 2.5,
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body1" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
          {FEEDBACK_RECEIVED_ACKNOWLEDGEMENT}
        </Typography>
      </Paper>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: 'center' }}>
      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={onClose}
        sx={{ minWidth: 160, borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
      >
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default FeedbackSubmittedDialog;
