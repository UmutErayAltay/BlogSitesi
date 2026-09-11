import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Blog Yazısını Sil</DialogTitle>
      <DialogContent>
        <DialogContentText>
          "{title}" başlıklı blog yazısını silmek istediğinizden emin misiniz?
          Bu işlem geri alınamaz.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog; 