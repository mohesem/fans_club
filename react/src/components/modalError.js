import React from 'react';

// material-ui component
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ErrorModal(props) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  function renderErrors() {
    const errArray = [];
    props.errors.forEach((obj, i) => {
      Object.keys(obj).forEach(key => {
        errArray.push(
          <DialogContentText style={{ color: 'red' }} key={i}>
            {obj[key]}
          </DialogContentText>
        );
      });
    });
    return errArray;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ERROR</DialogTitle>
        <DialogContent>{renderErrors()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
