import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
// import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';
import axios from 'axios'
export default function FileUploadModal(props) {

  const [open, setOpen]= React.useState(false)
  React.useEffect(()=>{
    if(props?.state){
        setOpen(props.state)
    }
  },[props.state])
  const handleClose=()=>{
    setOpen(false)
    props.changeFunc(false)
  }
  const handleSend = ()=>{
    props.handleFileUpload(title,description)
    handleClose()
  }

  const [title,setTitle]=React.useState()
  const [description, setDescription]=React.useState()

  return (
    <React.Fragment>
      <Modal open={open} onClose={() => handleClose()}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            Do you want to send this file?
          </Typography>
          <Typography id="basic-modal-dialog-description">
            Press send to send
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input autoFocus required 
                  onChange={(e)=>{setTitle(e.target.value)}}
              />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input autoFocus required 
                  onChange={(e)=>{setDescription(e.target.value)}}
                />
              </FormControl>
              <Button type="submit"
                onClick={()=>handleSend()}
              >Send</Button>
              <Button type="submit"
                onClick={()=>handleClose()}
              >Cancel</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
